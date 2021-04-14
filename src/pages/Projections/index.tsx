/* eslint-disable import/no-duplicates */
import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { Container, Grid } from '@material-ui/core';
import DatePicker, { registerLocale } from 'react-datepicker';
import MaterialTable from 'material-table';
import { Print } from '@material-ui/icons';
import { format, add, setDate } from 'date-fns';

import ptBR from 'date-fns/locale/pt-BR';
import _ from 'underscore';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import { lastDayOfMonth } from 'date-fns';
import { startOfMonth } from 'date-fns';
import { endOfMonth } from 'date-fns';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import BasePage from '../../components/BasePage';

import Loading from '../../components/Loading';

import {
  ContainerDatePicker,
  Label,
  Chip,
  EndDemonstrationValue,
  Button,
} from './styles';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';
import labels from '../../utils/labels';
import ProjectionsReport from './ProjectionsReport';

registerLocale('pt-BR', ptBR);

export interface Projection {
  due_date: string;
  mov: string;
  value: number;
  description: string;
}

export interface Balance {
  date?: Date;
  value: number;
}

const Projections: React.FC = () => {
  const [minStartDate, setMinStartDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    startOfMonth(add(new Date(), { months: 1 })),
  );
  const [viewProjection, setViewProjection] = useState<Projection[]>([]);
  const [financialPostings, setFinancialPostings] = useState<Projection[]>([]);
  const [lastBalance, setLastBalance] = useState<Balance>({
    value: 0,
    date: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);

  const handleChangeStartDate = useCallback(
    (date: Date) => {
      if (date) {
        setStartDate(date);
        if (date.getTime() > endDate.getTime()) {
          setEndDate(add(startOfMonth(date), { months: 1 }));
        }
      }
    },
    [endDate, setEndDate],
  );

  const handleChangeEndDate = useCallback((date: Date) => {
    if (date) {
      setEndDate(date);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/bank-accounts')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          const returnBalance: Balance = {
            value: 0,
            date: undefined,
          };
          res.data.forEach(el => {
            const sortedBank = _.sortBy(el.bank_account_values, 'date');
            const last = sortedBank[sortedBank.length - 1];
            returnBalance.value += last.amount_invested + last.amount_account;
            if (
              returnBalance.date === undefined ||
              returnBalance.date < new Date(last.date)
            ) {
              returnBalance.date = new Date(last.date);
            }
          });
          setLastBalance(returnBalance);
          const lastBalanceDate = add(returnBalance.date ?? new Date(), {
            months: 1,
          });
          setMinStartDate(lastBalanceDate);
          setStartDate(lastBalanceDate);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleGenerateDemonstration = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get('/projection', {
        params: {
          startDate: format(setDate(startDate, 1), 'yyyy-MM-dd'),
          endDate: format(lastDayOfMonth(endDate), 'yyyy-MM-dd'),
        },
      }),
      api.get('/financial-postings', {
        params: {
          ref_financial_posting_id: 'null',
          only_pays: 'non_payment',
          end_due_date: `${format(
            endOfMonth(add(startDate, { months: -1 })),
            'yyyy-MM-dd',
          )}`,
        },
      }),
    ])
      .then(res => {
        setViewProjection(res[0].data);
        setFinancialPostings(res[1].data);
        setSelected(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate, endDate]);

  const openCred = useMemo(() => {
    const res = financialPostings.reduce((acc, cv) => {
      if (cv.mov === 'D') {
        return acc + cv.value;
      }
      return acc;
    }, 0);
    return res;
  }, [financialPostings]);

  const openDeb = useMemo(() => {
    return financialPostings.reduce((acc, cv) => {
      if (cv.mov === 'C') {
        return acc + cv.value;
      }
      return acc;
    }, 0);
  }, [financialPostings]);

  const acumulatedBalance = useMemo(() => {
    return lastBalance.value + openCred + openDeb * -1;
  }, [lastBalance, openCred, openDeb]);

  const months = useMemo(() => {
    const monthsLabels = viewProjection.reduce((acc: any, cv: any) => {
      return [...acc, cv.due_date];
    }, []);

    return _.sortBy([...new Set(monthsLabels)]);
  }, [viewProjection]);

  const tableData = useMemo(() => {
    const defaultMonths = months.reduce((acc, cv) => {
      return {
        ...acc,
        [cv]: 0,
      };
    }, {});

    const categories = viewProjection.reduce((acc: any, cv) => {
      let notFind = true;
      for (let i = 0; i < acc.length; i += 1) {
        const element = acc[i];
        if (
          element?.mov === cv.mov &&
          element?.description === cv.description
        ) {
          acc[i][cv.due_date] = acc[i][cv.due_date]
            ? acc[i][cv.due_date] + cv.value
            : cv.value;
          notFind = false;
          break;
        }
      }
      if (notFind) {
        return [
          ...acc,
          {
            description: cv.description,
            mov: cv.mov,
            [cv.due_date]: cv.value,
          },
        ];
      }
      return acc;
    }, []);

    return _.sortBy(
      categories.map((cv: any) => {
        let total = 0;
        Object.keys(cv).forEach(key => {
          if (!['mov', 'description'].includes(key)) {
            cv[key] = Number.parseFloat(cv[key].toFixed(2));
            total += cv[key];
          }
        });
        return {
          ...defaultMonths,
          ...cv,
          total,
        };
      }),
      'description',
    ).filter(cv => cv.total > 0);
  }, [months, viewProjection]);

  const tableSummary = useMemo((): any[] => {
    if (tableData.length > 0) {
      let summary = {
        description: 'Total Mês',
        mov: '',
        total: tableData.reduce((acc, cv) => {
          return acc + cv.total * (cv.mov === 'C' ? -1 : 1);
        }, 0),
      };
      months.forEach(key => {
        summary = {
          ...summary,
          [key]: tableData.reduce((acc, cv) => {
            return acc + cv[key] * (cv.mov === 'C' ? -1 : 1);
          }, 0),
        };
      });
      return [summary];
    }
    return [];
  }, [tableData, months]);

  const tableCumulativeSummary = useMemo((): any[] => {
    if (tableData.length > 0) {
      let summary = {
        description: 'Total Acumulado',
        mov: '',
        total: 0,
      };
      let sum = acumulatedBalance;
      months.forEach(key => {
        sum += tableSummary[0][key];
        summary = {
          ...summary,
          [key]: sum,
        };
      });
      summary.total = sum;
      return [summary];
    }
    return [];
  }, [tableData, acumulatedBalance, months, tableSummary]);

  const printReportHandle = useCallback(async () => {
    const doc = (
      <ProjectionsReport
        tableData={[...tableData, ...tableSummary, ...tableCumulativeSummary]}
        lastBalance={lastBalance}
        openCred={openCred}
        openDeb={openDeb}
        startDate={startDate}
        endDate={lastDayOfMonth(endDate)}
        months={months}
      />
    );
    const asPdf = pdf([] as any);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    saveAs(blob, `projecao_financeira.pdf`);
  }, [
    endDate,
    lastBalance,
    months,
    openCred,
    openDeb,
    startDate,
    tableCumulativeSummary,
    tableData,
    tableSummary,
  ]);

  return (
    <BasePage title="Projeção Financeira">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Grid container spacing={2} style={{ padding: 16 }}>
            <Grid item xs={12} md={3}>
              <Label>
                {/* {Icon && <Icon size={20} />} */}
                Período Inicial
              </Label>
              <ContainerDatePicker>
                <DatePicker
                  selected={startDate}
                  minDate={minStartDate}
                  onChange={handleChangeStartDate}
                  dateFormat="MM/yyyy"
                  locale="pt-BR"
                  showMonthYearPicker
                />
              </ContainerDatePicker>
            </Grid>
            <Grid item xs={12} md={3}>
              <Label>
                {/* {Icon && <Icon size={20} />} */}
                Período Final
              </Label>
              <ContainerDatePicker>
                <DatePicker
                  selected={endDate}
                  onChange={handleChangeEndDate}
                  minDate={add(startDate, { months: 1 })}
                  startDate={startDate}
                  dateFormat="MM/yyyy"
                  locale="pt-BR"
                  showMonthYearPicker
                />
              </ContainerDatePicker>
            </Grid>
            <Grid
              item
              xs={12}
              md={2}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Button onClick={handleGenerateDemonstration}>
                Gerar Projeção
              </Button>
            </Grid>
            {selected && (
              <Grid
                item
                xs={12}
                md={2}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Button type="button" onClick={printReportHandle}>
                  Relatório <Print />
                </Button>
              </Grid>
            )}
          </Grid>
          {selected && (
            <>
              <Grid container spacing={2} style={{ padding: 16 }}>
                <EndDemonstrationValue>
                  <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
                    {`Fechamento ${
                      lastBalance.date?.toLocaleDateString('pt-br').slice(3) ??
                      ''
                    }:`}
                    <span>
                      <Chip
                        color="#FFF"
                        backgroundColor={
                          lastBalance.value > 0 ? '#12a454' : '#c53030'
                        }
                      >
                        {formatValue(lastBalance.value)}
                      </Chip>
                    </span>
                  </Grid>
                  <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
                    Valor Aberto (Créditos)
                    <span>
                      <Chip color="#FFF" backgroundColor="#12a454">
                        {formatValue(openCred)}
                      </Chip>
                    </span>
                  </Grid>
                  <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
                    Valor Aberto (Débitos)
                    <span>
                      <Chip color="#FFF" backgroundColor="#c53030">
                        {formatValue(openDeb)}
                      </Chip>
                    </span>
                  </Grid>
                </EndDemonstrationValue>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                  <MaterialTable
                    title="Projeção"
                    localization={labels.materialTable.localization}
                    columns={[
                      {
                        title: 'Descrição',
                        field: 'description',
                        width: '200px',
                      },
                      {
                        title: 'Mov.',
                        field: 'mov',
                        width: '50px',
                        render: rowData => {
                          if (rowData.mov === 'C') {
                            return <RemoveIcon />;
                          }
                          if (rowData.mov === 'D') {
                            return <AddIcon />;
                          }
                          return '';
                        },
                      },
                      ...months.map(cv => {
                        return {
                          title: `${cv.slice(4)}/${cv.slice(0, 4)}`,
                          field: cv,
                          width: '130px',
                          render: (rowData: any) => {
                            if (rowData[cv] !== 0) {
                              let color = '#12a454';
                              if (
                                rowData.mov === 'C' ||
                                (rowData.mov === '' && rowData[cv] < 0)
                              ) {
                                color = '#c53030';
                              }
                              return (
                                <Chip color="#FFF" backgroundColor={color}>
                                  {Intl.NumberFormat('pt-br', {
                                    maximumFractionDigits: 2,
                                  }).format(rowData[cv])}
                                </Chip>
                              );
                            }
                            return '';
                          },
                        };
                      }),
                      {
                        title: 'Total',
                        field: 'total',
                        width: '140px',
                        render: (rowData: any) => {
                          let color = '#12a454';
                          if (
                            rowData.mov === 'C' ||
                            (rowData.mov === '' && rowData.total < 0)
                          ) {
                            color = '#c53030';
                          }
                          return (
                            <Chip color="#FFF" backgroundColor={color}>
                              {Intl.NumberFormat('pt-br', {
                                maximumFractionDigits: 2,
                              }).format(rowData.total)}
                            </Chip>
                          );
                        },
                      },
                    ]}
                    data={[
                      ...tableData,
                      ...tableSummary,
                      ...tableCumulativeSummary,
                    ]}
                    style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
                    options={{
                      pageSize: 5,
                      headerStyle: {
                        zIndex: 0,
                        backgroundColor: '#6b9ec7',
                      },
                      fixedColumns: {
                        left: 2,
                      },
                      rowStyle: rowData => {
                        let color = '#FFF';
                        if (rowData.description === 'Total Mês') {
                          color = '#d7edff';
                        } else if (rowData.description === 'Total Acumulado') {
                          color = '#badaf5';
                        }
                        return {
                          backgroundColor: color,
                        };
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      )}
    </BasePage>
  );
};

export default Projections;

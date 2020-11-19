/* eslint-disable import/no-duplicates */
import React, { useState, useCallback, useMemo } from 'react';

import { Container, Grid } from '@material-ui/core';
import DatePicker, { registerLocale } from 'react-datepicker';
import MaterialTable from 'material-table';

import { format } from 'date-fns';

import ptBR from 'date-fns/locale/pt-BR';
import BasePage from '../../components/BasePage';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

import {
  ContainerDatePicker,
  Label,
  StartDemonstrationValue,
  Chip,
  CardInfo,
  EndDemonstrationValue,
} from './styles';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';
import labels from '../../utils/labels';

registerLocale('pt-BR', ptBR);

interface ViewData {
  date: string;
  value_bank: number;
  total_month: number;
}

interface FinancialPosting {
  id?: string;
  obreiro?: {
    id: string;
    name: string;
  };
  costCenter: {
    id: string;
    description: string;
  };
  teller: {
    id: string;
    description: string;
  };
  typeFinancialPosting: {
    id: string;
    description: string;
  };
  date: string;
  mov: string;
  value: number;
  value_formatted?: string;
  due_date?: string;
  payday?: string;
}

const Demonstrations: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [viewData, setViewData] = useState<ViewData[]>([]);
  const [financialPostings, setFinancialPostings] = useState<
    FinancialPosting[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleChangeStartDate = useCallback((date: Date) => {
    if (date) {
      setStartDate(date);
    }
  }, []);

  const handleGenerateDemonstration = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get('/demonstration', {
        params: {
          date: format(startDate, 'MM/yyyy'),
        },
      }),
      api.get('/financial-postings', {
        params: {
          start_date: format(
            new Date(startDate.getFullYear(), startDate.getMonth(), 1),
            'yyyy-MM-dd',
          ),
          end_date: format(
            new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0),
            'yyyy-MM-dd',
          ),
        },
      }),
    ])
      .then(res => {
        setViewData(res[0].data);
        setFinancialPostings(res[1].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate]);

  const totalValue = useMemo(() => {
    return viewData.reduce((acc, data, index) => {
      if (index === 0) {
        acc = data.value_bank + data.total_month;
      } else {
        acc += data.total_month;
      }

      return acc;
    }, 0);
  }, [viewData]);

  const valueInitial = useMemo(() => {
    if (viewData.length > 0) {
      const valueMonth = viewData[viewData.length - 1].total_month;
      let startValue = 0;
      if (valueMonth > 0) {
        startValue = totalValue - valueMonth;
        return startValue;
      }
      startValue = totalValue + valueMonth;
      return startValue;
    }
    return 0;
  }, [viewData, totalValue]);

  const debitLoja = useMemo(() => {
    return financialPostings.reduce((acc, posting) => {
      if (posting.mov === 'D' && posting.costCenter.description === 'Loja') {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [financialPostings]);

  const creditLoja = useMemo(() => {
    return financialPostings.reduce((acc, posting) => {
      if (
        posting.mov === 'C' &&
        posting.obreiro === null &&
        posting.costCenter.description === 'Loja'
      ) {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [financialPostings]);

  const totalLoja = useMemo(() => {
    return debitLoja - creditLoja;
  }, [debitLoja, creditLoja]);

  const debitLiga = useMemo(() => {
    return financialPostings.reduce((acc, posting) => {
      if (posting.mov === 'D' && posting.costCenter.description === 'Liga') {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [financialPostings]);

  const creditLiga = useMemo(() => {
    return financialPostings.reduce((acc, posting) => {
      if (
        posting.mov === 'C' &&
        posting.obreiro === null &&
        posting.costCenter.description === 'Liga'
      ) {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [financialPostings]);

  const totalLiga = useMemo(() => {
    return debitLiga - creditLiga;
  }, [debitLiga, creditLiga]);

  const total = useMemo(() => {
    return totalLiga + totalLoja;
  }, [totalLiga, totalLoja]);

  return (
    <BasePage title="Demonstração Financeira">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Grid container spacing={2} style={{ padding: 16 }}>
            <Grid item xs={12} md={6}>
              <Label>
                {/* {Icon && <Icon size={20} />} */}
                Período
              </Label>
              <ContainerDatePicker>
                <DatePicker
                  selected={startDate}
                  onChange={handleChangeStartDate}
                  dateFormat="MM/yyyy"
                  locale="pt-BR"
                  showMonthYearPicker
                />
              </ContainerDatePicker>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Button onClick={handleGenerateDemonstration}>
                Gerar Demonstrativo
              </Button>
            </Grid>
          </Grid>
          {viewData.length > 0 && (
            <>
              <Grid container spacing={2} style={{ padding: 16 }}>
                <StartDemonstrationValue>
                  Valor Inicial: <span>{formatValue(valueInitial)}</span>
                </StartDemonstrationValue>
              </Grid>
              <MaterialTable
                title="Demonstrativo"
                localization={labels.materialTable.localization}
                columns={[
                  { title: 'Data', field: 'date', type: 'date', width: '15%' },
                  { title: 'Obs.', field: 'obs', width: '40%' },
                  {
                    title: 'Tipo',
                    field: 'typeFinancialPosting.description',
                    width: '15%',
                  },
                  {
                    title: 'Loja',
                    width: '15%',
                    render: row =>
                      row.costCenter.description === 'Loja' && (
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            row.mov === 'D' ? '#12a454' : '#c53030'
                          }
                        >
                          {formatValue(row.value)}
                        </Chip>
                      ),
                  },
                  {
                    title: 'Liga',
                    width: '15%',
                    render: row =>
                      row.costCenter.description === 'Liga' && (
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            row.mov === 'D' ? '#12a454' : '#c53030'
                          }
                        >
                          {formatValue(row.value)}
                        </Chip>
                      ),
                  },
                ]}
                data={[...financialPostings]}
                style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
                options={{
                  pageSize: 10,
                  headerStyle: {
                    zIndex: 0,
                  },
                }}
              />

              <Grid container spacing={2} style={{ padding: 16 }}>
                <Grid item xs={12} md={4}>
                  <CardInfo>
                    <div className="item">
                      Total débito Loja:
                      <span>
                        <Chip color="#FFF" backgroundColor="#12a454">
                          {formatValue(debitLoja)}
                        </Chip>
                      </span>
                    </div>
                    <div className="item">
                      Total crédito Loja:
                      <span>
                        <Chip color="#FFF" backgroundColor="#c53030">
                          {formatValue(creditLoja)}
                        </Chip>
                      </span>
                    </div>
                    <hr className="divider" />
                    <div className="item">
                      Total Loja:
                      <span>
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            totalLoja > 0 ? '#12a454' : '#c53030'
                          }
                        >
                          {formatValue(totalLoja)}
                        </Chip>
                      </span>
                    </div>
                  </CardInfo>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CardInfo>
                    <div className="item">
                      Total débito Liga:
                      <span>
                        <Chip color="#FFF" backgroundColor="#12a454">
                          {formatValue(debitLiga)}
                        </Chip>
                      </span>
                    </div>
                    <div className="item">
                      Total crédito Liga:
                      <span>
                        <Chip color="#FFF" backgroundColor="#c53030">
                          {formatValue(creditLiga)}
                        </Chip>
                      </span>
                    </div>
                    <hr className="divider" />
                    <div className="item">
                      Total Liga:
                      <span>
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            totalLiga > 0 ? '#12a454' : '#c53030'
                          }
                        >
                          {formatValue(totalLiga)}
                        </Chip>
                      </span>
                    </div>
                  </CardInfo>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CardInfo>
                    <div className="item">
                      Total Loja:
                      <span>
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            totalLoja > 0 ? '#12a454' : '#c53030'
                          }
                        >
                          {formatValue(totalLoja)}
                        </Chip>
                      </span>
                    </div>
                    <div className="item">
                      Total Liga:
                      <span>
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            totalLiga > 0 ? '#12a454' : '#c53030'
                          }
                        >
                          {formatValue(totalLiga)}
                        </Chip>
                      </span>
                    </div>
                    <hr className="divider" />
                    <div className="item">
                      Total Geral:
                      <span>
                        <Chip
                          color="#FFF"
                          backgroundColor={total > 0 ? '#12a454' : '#c53030'}
                        >
                          {formatValue(total)}
                        </Chip>
                      </span>
                    </div>
                  </CardInfo>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ padding: 16 }}>
                <EndDemonstrationValue>
                  Valor Final:{' '}
                  <span>
                    <Chip
                      color="#FFF"
                      backgroundColor={
                        totalValue > valueInitial ? '#12a454' : '#c53030'
                      }
                    >
                      {formatValue(totalValue)}
                    </Chip>
                  </span>
                </EndDemonstrationValue>
              </Grid>
            </>
          )}
        </Container>
      )}
    </BasePage>
  );
};

export default Demonstrations;

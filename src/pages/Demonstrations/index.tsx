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
  // StartDemonstrationValue,
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

interface ViewDonation {
  date: string;
  debit: number;
  credit: number;
  final_value: number;
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
  donation: boolean;
}

interface BankAccountData {
  id: string;
  description: string;
  bank_account_values: BankAccountValuesData[];
}

interface BankAccountValuesData {
  amount_account: number;
  amount_invested: number;
  date: string;
}

const Demonstrations: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [viewData, setViewData] = useState<ViewData[]>([]);
  const [viewDonations, setViewDonations] = useState<ViewDonation[]>([]);
  const [financialPostings, setFinancialPostings] = useState<
    FinancialPosting[]
  >([]);
  const [donations, setDonations] = useState<FinancialPosting[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChangeStartDate = useCallback((date: Date) => {
    if (date) {
      setStartDate(date);
      setViewData([]);
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
      api.get('/bank-accounts'),
      api.get('/donations', {
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
      api.get('/donations/view-report', {
        params: {
          date: format(startDate, 'MM/yyyy'),
        },
      }),
    ])
      .then(res => {
        setViewData(res[0].data);
        setFinancialPostings(res[1].data);
        setBankAccounts(res[2].data);
        setDonations(res[3].data);
        setViewDonations(res[4].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate]);

  const dataToBeUsed = useMemo(() => {
    const data = financialPostings.concat(donations);

    return data
      .filter(posting => {
        if (posting.donation) {
          if (posting.mov === 'D') {
            return posting;
          }
          return null;
        }
        return posting;
      })
      .sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        }
        if (b.date > a.date) {
          return -1;
        }
        return 0;
      });
  }, [financialPostings, donations]);

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
      startValue = totalValue - valueMonth;
      return startValue;
      // console.log('menor');
      // startValue = totalValue + valueMonth;
      // return startValue;
    }
    return 0;
  }, [viewData, totalValue]);

  const debitLoja = useMemo(() => {
    return dataToBeUsed.reduce((acc, posting) => {
      if (posting.mov === 'D' && posting.costCenter.description === 'Loja') {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [dataToBeUsed]);

  const creditLoja = useMemo(() => {
    return dataToBeUsed.reduce((acc, posting) => {
      if (
        posting.mov === 'C' &&
        posting.obreiro === null &&
        posting.costCenter.description === 'Loja'
      ) {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [dataToBeUsed]);

  const totalLoja = useMemo(() => {
    return debitLoja - creditLoja;
  }, [debitLoja, creditLoja]);

  const debitLiga = useMemo(() => {
    return dataToBeUsed.reduce((acc, posting) => {
      if (posting.mov === 'D' && posting.costCenter.description === 'Liga') {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [dataToBeUsed]);

  const creditLiga = useMemo(() => {
    return dataToBeUsed.reduce((acc, posting) => {
      if (
        posting.mov === 'C' &&
        posting.obreiro === null &&
        posting.costCenter.description === 'Liga'
      ) {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [dataToBeUsed]);

  const totalLiga = useMemo(() => {
    return debitLiga - creditLiga;
  }, [debitLiga, creditLiga]);

  const total = useMemo(() => {
    return totalLiga + totalLoja;
  }, [totalLiga, totalLoja]);

  const bankAccountsCurrentMonth = useMemo(() => {
    const bankAccountsCurrent: BankAccountData[] = bankAccounts.map(bank => {
      return {
        ...bank,
        bank_account_values: bank.bank_account_values.filter(
          value =>
            format(new Date(value.date), 'MM/yyyy') ===
            format(startDate, 'MM/yyyy'),
        ),
      };
    });

    return bankAccountsCurrent;
  }, [bankAccounts, startDate]);

  const totalValueBanks = useMemo(() => {
    let totalValues = 0;
    bankAccounts.map(bank => {
      bank.bank_account_values.map(value => {
        if (
          format(new Date(value.date), 'MM/yyyy') ===
          format(startDate, 'MM/yyyy')
        ) {
          totalValues += value.amount_account + value.amount_invested;
        }

        return value;
      });
      return bank;
    });

    return totalValues;
  }, [bankAccounts, startDate]);

  const totalTreasurer = useMemo(() => {
    return totalValue - totalValueBanks;
  }, [totalValue, totalValueBanks]);

  const totalTronco = useMemo(() => {
    return donations.reduce((acc, donation) => {
      if (
        donation.mov === 'D' &&
        donation.typeFinancialPosting.description === 'Tronco'
      ) {
        return acc + donation.value;
      }

      return acc;
    }, 0);
  }, [donations]);

  const troncoCurrent = useMemo(() => {
    return viewDonations.find(
      viewDonation => viewDonation.date === format(startDate, 'MM/yyyy'),
    );
  }, [startDate, viewDonations]);

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
                <EndDemonstrationValue>
                  Valor Inicial:
                  <span>
                    <Chip
                      color="#FFF"
                      backgroundColor={valueInitial > 0 ? '#12a454' : '#c53030'}
                    >
                      {formatValue(valueInitial)}
                    </Chip>
                  </span>
                </EndDemonstrationValue>
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
                data={[...dataToBeUsed]}
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
                    <div className="title">Saldo Loja</div>
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
                    <div className="title">Saldo Liga</div>
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
                    <div className="title">Saldo Total</div>
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
              <Grid container spacing={2}>
                {bankAccountsCurrentMonth.length > 0 &&
                  bankAccountsCurrentMonth.map(bank => {
                    if (bank.bank_account_values[0]) {
                      return (
                        <Grid item xs={12} md={4} key={bank.id}>
                          <CardInfo>
                            <div className="title">
                              Saldo {bank.description}
                            </div>
                            <div className="item">
                              Valor em conta:
                              <span>
                                <Chip color="#FFF" backgroundColor="#12a454">
                                  {formatValue(
                                    bank.bank_account_values[0].amount_account,
                                  )}
                                </Chip>
                              </span>
                            </div>
                            <div className="item">
                              Valor em investimento:
                              <span>
                                <Chip color="#FFF" backgroundColor="#12a454">
                                  {formatValue(
                                    bank.bank_account_values[0].amount_invested,
                                  )}
                                </Chip>
                              </span>
                            </div>
                            <hr className="divider" />
                            <div className="item">
                              Total Geral:
                              <span>
                                <Chip color="#FFF" backgroundColor="#12a454">
                                  {formatValue(
                                    bank.bank_account_values[0]
                                      .amount_invested +
                                      bank.bank_account_values[0]
                                        .amount_account,
                                  )}
                                </Chip>
                              </span>
                            </div>
                          </CardInfo>
                        </Grid>
                      );
                    }
                    return null;
                  })}
                <Grid item xs={12} md={4}>
                  <CardInfo>
                    <div className="title">Saldo Tesoureiro</div>
                    <div className="item">
                      Valor Final:
                      <span>
                        <Chip color="#FFF" backgroundColor="#12a454">
                          {formatValue(totalValue)}
                        </Chip>
                      </span>
                    </div>
                    <div className="item">
                      Total Bancos:
                      <span>
                        <Chip color="#FFF" backgroundColor="#12a454">
                          {formatValue(totalValueBanks)}
                        </Chip>
                      </span>
                    </div>
                    <hr className="divider" />
                    <div className="item">
                      Saldo:
                      <span>
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            totalTreasurer > 0 ? '#12a454' : '#c53030'
                          }
                        >
                          {formatValue(totalTreasurer)}
                        </Chip>
                      </span>
                    </div>
                  </CardInfo>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ padding: 16 }}>
                <EndDemonstrationValue>
                  Total do Tronco{' '}
                  {format(startDate, 'MMM/yyyy', { locale: ptBR })}:
                  <span>
                    <Chip color="#FFF" backgroundColor="#12a454">
                      {formatValue(totalTronco)}
                    </Chip>
                  </span>
                </EndDemonstrationValue>
              </Grid>
              <Grid container spacing={2} style={{ padding: 16 }}>
                <Grid item xs={12} md={4}>
                  <CardInfo>
                    <div className="title">Saldo Tronco</div>
                    <div className="item">
                      Total Tronco:
                      <span>
                        <Chip color="#FFF" backgroundColor="#12a454">
                          {troncoCurrent &&
                            formatValue(
                              troncoCurrent.final_value + troncoCurrent.credit,
                            )}
                        </Chip>
                      </span>
                    </div>
                    <div className="item">
                      Doações:
                      <span>
                        <Chip color="#FFF" backgroundColor="#c53030">
                          {troncoCurrent && formatValue(troncoCurrent.credit)}
                        </Chip>
                      </span>
                    </div>
                    <hr className="divider" />
                    <div className="item">
                      Total Tronco Líquido:
                      <span>
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            troncoCurrent && troncoCurrent.final_value > 0
                              ? '#12a454'
                              : '#c53030'
                          }
                        >
                          {troncoCurrent &&
                            formatValue(troncoCurrent.final_value)}
                        </Chip>
                      </span>
                    </div>
                  </CardInfo>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CardInfo>
                    <div className="title">Saldo Total S/ Tronco</div>
                    <div className="item">
                      Valor Final:
                      <span>
                        <Chip color="#FFF" backgroundColor="#12a454">
                          {formatValue(totalValue)}
                        </Chip>
                      </span>
                    </div>
                    <div className="item">
                      Total Tronco Líquido:
                      <span>
                        <Chip color="#FFF" backgroundColor="#12a454">
                          {troncoCurrent &&
                            formatValue(troncoCurrent.final_value)}
                        </Chip>
                      </span>
                    </div>
                    <hr className="divider" />
                    <div className="item">
                      Total:
                      <span>
                        <Chip
                          color="#FFF"
                          backgroundColor={
                            troncoCurrent &&
                            totalValue - troncoCurrent.final_value > 0
                              ? '#12a454'
                              : '#c53030'
                          }
                        >
                          {troncoCurrent &&
                            formatValue(totalValue - troncoCurrent.final_value)}
                        </Chip>
                      </span>
                    </div>
                  </CardInfo>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      )}
    </BasePage>
  );
};

export default Demonstrations;

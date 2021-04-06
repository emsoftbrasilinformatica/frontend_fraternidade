/* eslint-disable array-callback-return */
import React, { useState, useCallback, useMemo } from 'react';

import { Container, Grid } from '@material-ui/core';
import { Visibility, Search, VisibilityOff } from '@material-ui/icons';
import DatePicker from 'react-datepicker';
import MaterialTable from 'material-table';

import { format } from 'date-fns';
import {
  Button,
  DateRangePickerContent,
  Label,
  TotalValueContainer,
} from './styles';

import BasePage from '../../components/BasePage';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import Loading from '../../components/Loading';
import formatValue from '../../utils/formatValue';
import labels from '../../utils/labels';

interface FinancialPosting {
  id?: string;
  obreiro: {
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
  value_after_due: number;
  value_formatted?: string;
  due_date?: string;
  payday?: string;
}

interface DataGeneral {
  id: string;
  name: string;
  value: number;
  value_formatted?: string;
}

const FinancialConsultation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const dateAux = new Date();
  const [monthlyPayments, setMonthlyPayments] = useState<FinancialPosting[]>(
    [],
  );
  const [payments, setPayments] = useState<FinancialPosting[]>([]);
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(dateAux);
  const [selectedId, setSelectedId] = useState();
  const [users, setUsers] = useState<DataGeneral[]>([]);

  const handleChangeStartDate = useCallback((date: Date) => {
    if (date) {
      setStartDate(date);
    }
  }, []);

  const handleSelectId = useCallback(
    rowData => {
      if (selectedId === rowData.id) {
        setSelectedId(undefined);
      } else {
        setSelectedId(rowData.id);
      }
    },
    [selectedId],
  );

  const handleSearchNonPayments = useCallback(() => {
    setLoading(true);
    setSelectedId(undefined);
    let monthlyURL = '';
    let othersURL = '';
    let usersURL = '';
    let params = {};
    if (
      user.administrative_function &&
      (user.administrative_function.description === 'Venerável' ||
        user.administrative_function.description === 'Tesoureiro')
    ) {
      monthlyURL = '/non-monthly-payments/all';
      othersURL = '/non-payments/all';
      usersURL = '/non-payments/values-users';
      params = { date: format(startDate, 'yyyy-MM-dd') };
    } else {
      monthlyURL = '/non-monthly-payments/by-id';
      othersURL = '/non-payments/by-id';
      usersURL = '/non-payments/values-users-by-id';
      params = {
        date: format(startDate, 'yyyy-MM-dd'),
        user_id: user.id,
      };
    }

    Promise.all([
      api.get<FinancialPosting[]>(othersURL, {
        params,
      }),
      api.get<FinancialPosting[]>(monthlyURL, {
        params,
      }),
      api.get<DataGeneral[]>(usersURL, { params }),
    ])
      .then(res => {
        setPayments(
          res[0].data.map(result => {
            return {
              value_formatted: formatValue(result.value),
              ...result,
            };
          }),
        );

        setMonthlyPayments(
          res[1].data.map(result => {
            return {
              value_formatted: formatValue(result.value),
              ...result,
            };
          }),
        );

        setUsers(
          res[2].data.map(result => {
            return {
              ...result,
              value_formatted: formatValue(result.value),
            };
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate, user]);

  const paymentsGeneralByUser = useMemo(() => {
    const paymentsByUser = payments.filter(
      item => item.obreiro.id === selectedId,
    );

    const monthlyByUser = monthlyPayments.filter(
      item => item.obreiro.id === selectedId,
    );

    return [...paymentsByUser, ...monthlyByUser].sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return 1;
      }
      if (new Date(b.date) > new Date(a.date)) {
        return -1;
      }
      return 0;
    });
  }, [selectedId, monthlyPayments, payments]);

  const totalValue = useMemo(() => {
    const value = users.reduce((acc, userItem) => {
      const sum = acc + userItem.value;
      return sum;
    }, 0);

    return formatValue(value);
  }, [users]);

  return (
    <BasePage title="Consulta Financeira">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <Grid container spacing={2} style={{ marginTop: 16 }}>
              <Grid item xs={12} md={3}>
                <DateRangePickerContent>
                  <Label>Data</Label>
                  <DatePicker
                    name="initial_date"
                    selected={startDate}
                    onChange={handleChangeStartDate}
                    placeholderText="Selecione a data"
                    startDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    locale="pt-BR"
                  />
                </DateRangePickerContent>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button type="button" onClick={handleSearchNonPayments}>
                  Buscar
                  <Search />
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <MaterialTable
                  title=""
                  localization={labels.materialTable.localization}
                  columns={[
                    {
                      title: 'Obreiro',
                      field: 'name',
                    },
                    { title: 'Valor', field: 'value_formatted' },
                  ]}
                  data={[...users]}
                  options={{
                    pageSize: 10,
                    headerStyle: {
                      zIndex: 0,
                    },
                  }}
                  style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
                  actions={[
                    rowData => ({
                      icon: () =>
                        selectedId === rowData.id ? (
                          <VisibilityOff style={{ color: '#1976d2' }} />
                        ) : (
                          <Visibility style={{ color: '#1976d2' }} />
                        ),
                      onClick: () => handleSelectId(rowData),
                      tooltip:
                        rowData.id === selectedId
                          ? 'Fechar Financeiro'
                          : 'Ver Financeiro',
                    }),
                  ]}
                />
                <TotalValueContainer>
                  Valor Total: {totalValue}
                </TotalValueContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <MaterialTable
                  title=""
                  localization={labels.materialTable.localization}
                  columns={[
                    { title: 'Data', field: 'date', type: 'date' },
                    {
                      title: 'Tipo',
                      field: 'typeFinancialPosting.description',
                    },
                    {
                      title: 'Valor',
                      // field: 'value_formatted',
                      render: rowData => {
                        if (rowData?.due_date) {
                          if (startDate > new Date(rowData?.due_date)) {
                            return formatValue(rowData.value_after_due);
                          }
                        }
                        return rowData.value_formatted;
                      },
                    },
                    { title: 'Data Venc.', field: 'due_date', type: 'date' },
                    { title: 'Obs.', field: 'obs' },
                  ]}
                  data={[...paymentsGeneralByUser]}
                  options={{
                    pageSize: 10,
                    headerStyle: {
                      zIndex: 0,
                    },
                  }}
                  style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
                />
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </BasePage>
  );
};

export default FinancialConsultation;

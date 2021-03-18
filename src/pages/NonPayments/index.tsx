import React, { useState, useCallback } from 'react';

import { Container, Grid } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import MaterialTable from 'material-table';
import DatePicker from 'react-datepicker';

import { format } from 'date-fns';
import BasePage from '../../components/BasePage';
import Loading from '../../components/Loading';
import { Button, DateRangePickerContent, Label } from './styles';
import labels from '../../utils/labels';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';

export interface FinancialPosting {
  id?: string;
  obreiro?: {
    id: string;
    name: string;
    cim: string;
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

const NonPayments: React.FC = () => {
  const dateAux = new Date();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FinancialPosting[]>([]);
  const [startDate, setStartDate] = useState(dateAux);

  const handleChangeStartDate = useCallback((date: Date) => {
    if (date) {
      setStartDate(date);
    }
  }, []);

  const handleSearchNonPayments = useCallback(() => {
    setLoading(true);
    api
      .get<FinancialPosting[]>('/non-monthly-payments/all', {
        params: { date: format(startDate, 'yyyy-MM-dd') },
      })
      .then(res => {
        setData(
          res.data.map(result => {
            return {
              value_formatted: formatValue(result.value),
              ...result,
            };
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate]);

  return (
    <BasePage title="Inadimplentes">
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

            <MaterialTable
              title=""
              localization={labels.materialTable.localization}
              columns={[
                { title: 'Data', field: 'date', type: 'date' },
                { title: 'Tipo', field: 'typeFinancialPosting.description' },
                { title: 'Valor', field: 'value_formatted' },
                { title: 'C.C.', field: 'costCenter.description' },
                { title: 'Caixa', field: 'teller.description' },
                { title: 'Mov.', field: 'mov' },
                { title: 'Obreiro', field: 'obreiro.name' },
                { title: 'Data Venc.', field: 'due_date', type: 'date' },
              ]}
              data={[...data]}
              options={{
                pageSize: 10,
                headerStyle: {
                  zIndex: 0,
                },
              }}
              style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
            />
          </Container>
        </>
      )}
    </BasePage>
  );
};

export default NonPayments;

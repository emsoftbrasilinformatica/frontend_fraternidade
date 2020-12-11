/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useRef, useEffect } from 'react';

import { Container, Grid } from '@material-ui/core';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { useParams } from 'react-router-dom';

import { FaCalendarDay, FaSort } from 'react-icons/fa';
import { TiSortNumerically } from 'react-icons/ti';
import { HiCurrencyDollar } from 'react-icons/hi';
import { FiInfo } from 'react-icons/fi';
import MaterialTable from 'material-table';
import BasePage from '../../../components/BasePage';
import Card from '../../../components/Card';
import DatePicker from '../../../components/DatePicker';
import api from '../../../services/api';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import labels from '../../../utils/labels';
import Loading from '../../../components/Loading';

interface params {
  id: string;
}

interface OptionsData {
  id: string;
  description: string;
  type: string;
  degree: {
    description: string;
  };
  value: string;
  label: string;
}

interface SessionDayOrder {
  id: string;
  description: string;
  tableData: {
    id: string;
  };
}

const OneSession: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const params: params = useParams();
  const [sessionTypes, setSessionTypes] = useState<OptionsData[]>([]);
  const [sessionDayOrders, setSessionDayOrders] = useState<SessionDayOrder[]>(
    [],
  );

  useEffect(() => {
    api.get('/session-types').then(response => {
      setSessionTypes(
        response.data.map((option: OptionsData) => {
          const description = `${option.type.substring(0, 1)} - ${
            option.description
          } - ${option.degree.description}`;
          return {
            ...option,
            label: description,
            value: option.id,
          };
        }),
      );
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api.get(`/sessions/show/${params.id}`).then(res => {
        const description = `${res.data.session_type.type.substring(0, 1)} - ${
          res.data.session_type.description
        } - ${res.data.session_type.degree.description}`;
        setSessionDayOrders(res.data.session_day_orders);
        setLoading(false);
        formRef.current?.setData({
          session_type_id: {
            value: res.data.session_type_id,
            label: description,
          },
          date: new Date(res.data.date),
          number: res.data.number,
          obs: res.data.obs,
          tronco_beneficencia: res.data.tronco_beneficencia,
        });
      });
    }
  }, [params.id]);

  return (
    <BasePage title="Visualizar Sessão" backLink="/app/geral/agenda-sessoes">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form ref={formRef} onSubmit={() => {}}>
            <Card title="Informações da sessão">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Input
                    name="number"
                    label="Número da sessão"
                    icon={TiSortNumerically}
                    placeholder="Insira o número da sessão"
                    justRead
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    name="date"
                    label="Data - Hora"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy '-' HH:mm"
                    timeCaption="Horário"
                    icon={FaCalendarDay}
                    placeholderText="Selecione a data - hora"
                    justRead
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    name="session_type_id"
                    label="Tipo de Sessão"
                    placeholder="Selecione o tipo de sessão"
                    icon={FaSort}
                    options={sessionTypes}
                    isDisabled
                    isClearable
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Input
                    name="tronco_beneficencia"
                    label="Tronco de Beneficência"
                    icon={HiCurrencyDollar}
                    placeholder="Digite o valor"
                    type="number"
                    step={0.01}
                    justRead
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Input
                    name="obs"
                    label="Observação"
                    placeholder="Digite a observação"
                    icon={FiInfo}
                    justRead
                  />
                </Grid>
              </Grid>

              <MaterialTable
                title="Ordens do dia"
                columns={[
                  {
                    title: 'Descrição',
                    field: 'description',
                  },
                ]}
                data={sessionDayOrders}
                localization={labels.materialTable.localization}
                style={{
                  marginTop: 16,
                  border: '2px solid #0f5e9e',
                }}
                options={{
                  headerStyle: {
                    zIndex: 0,
                  },
                }}
              />
            </Card>
          </Form>
        </Container>
      )}
    </BasePage>
  );
};

export default OneSession;

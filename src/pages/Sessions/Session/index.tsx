import React, { useState, useRef, useCallback, useEffect } from 'react';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { format, isBefore } from 'date-fns';

import { useParams, useHistory } from 'react-router-dom';

import { FaCalendarDay, FaSort } from 'react-icons/fa';
import { TiSortNumerically } from 'react-icons/ti';
import { HiCurrencyDollar } from 'react-icons/hi';
import { FiInfo } from 'react-icons/fi';
import MaterialTable from 'material-table';
import BasePage from '../../../components/BasePage';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import DatePicker from '../../../components/DatePicker';
import api from '../../../services/api';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import labels from '../../../utils/labels';
import { useToast } from '../../../hooks/toast';
import { useAuth } from '../../../hooks/auth';
import getValidationErrors from '../../../utils/getValidationErrors';
import Loading from '../../../components/Loading';

interface params {
  id: string;
}

interface DataForm {
  user_id: string;
  session_type_id: string;
  date: string;
  number: string;
  obs: string;
  tronco_beneficencia: string;
  session_day_orders: { description: string }[];
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

const Session: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [canSave, setCanSave] = useState(true);
  const params: params = useParams();
  const [sessionTypes, setSessionTypes] = useState<OptionsData[]>([]);
  const [sessionDayOrders, setSessionDayOrders] = useState<SessionDayOrder[]>(
    [],
  );
  const { addToast } = useToast();
  const { user } = useAuth();
  const history = useHistory();

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

        if (isBefore(new Date(res.data.date), new Date())) {
          setCanSave(false);
        }
      });
    }
  }, [params.id]);

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          number: Yup.string().required('Número é obrigatório'),
          date: Yup.string().nullable().required('Data - Hora é obrigatório'),
          session_type_id: Yup.string().required(
            'Tipo de Sessão é obirgatório',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setSaveLoading(true);

        const dataForm: DataForm = {
          user_id: user.id,
          session_type_id: data.session_type_id,
          number: data.number,
          date: format(new Date(data.date), 'yyyy-MM-dd HH:mm'),
          obs: data.obs,
          tronco_beneficencia: data.tronco_beneficencia
            ? data.tronco_beneficencia
            : null,
          session_day_orders: sessionDayOrders.map(sessionDayOrder => ({
            description: sessionDayOrder.description,
          })),
        };

        if (params.id) {
          await api.put(`/sessions/${params.id}`, dataForm);
        } else {
          await api.post('/sessions', dataForm);
        }

        setSaveLoading(false);
        history.push('/app/cad/sessoes');
        addToast({
          type: 'success',
          title: 'Sessão agendada com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        setSaveLoading(false);

        console.log(err);
        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, sessionDayOrders, user.id, params.id, history],
  );

  return (
    <BasePage
      title={params.id ? 'Editar Sessão' : 'Nova Sessão'}
      backLink="/app/cad/sessoes"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form ref={formRef} onSubmit={handleSubmit}>
            {canSave && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" disabled={!!saveLoading}>
                  {saveLoading ? (
                    <CircularProgress style={{ color: '#FFF' }} />
                  ) : (
                    'SALVAR'
                  )}
                </Button>
              </div>
            )}

            <Card title="Informações da sessão">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Input
                    name="number"
                    label="Número da sessão"
                    icon={TiSortNumerically}
                    placeholder="Insira o número da sessão"
                    justRead={!canSave}
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
                    justRead={!canSave}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    name="session_type_id"
                    label="Tipo de Sessão"
                    placeholder="Selecione o tipo de sessão"
                    icon={FaSort}
                    options={sessionTypes}
                    isDisabled={!canSave}
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
                    justRead={!canSave}
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Input
                    name="obs"
                    label="Observação"
                    placeholder="Digite a observação"
                    icon={FiInfo}
                    justRead={!canSave}
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
                editable={
                  canSave
                    ? {
                        onRowAdd: newData =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              setSessionDayOrders([
                                ...sessionDayOrders,
                                newData,
                              ]);

                              resolve();
                            }, 1000);
                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              const dataUpdated = sessionDayOrders.map(
                                sessionDayOrder => {
                                  if (
                                    sessionDayOrder.tableData.id ===
                                    oldData?.tableData.id
                                  ) {
                                    sessionDayOrder.description =
                                      newData.description;
                                  }

                                  return sessionDayOrder;
                                },
                              );
                              setSessionDayOrders(dataUpdated);

                              resolve();
                            }, 1000);
                          }),
                        onRowDelete: oldData =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              const dataUpdated = sessionDayOrders.filter(
                                sessionDayOrder =>
                                  sessionDayOrder.tableData.id !==
                                  oldData.tableData.id,
                              );
                              setSessionDayOrders(dataUpdated);

                              resolve();
                            }, 1000);
                          }),
                      }
                    : {}
                }
              />
            </Card>
          </Form>
        </Container>
      )}
    </BasePage>
  );
};

export default Session;

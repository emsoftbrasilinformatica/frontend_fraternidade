import React, { useState, useRef, useCallback, useEffect } from 'react';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import axios from 'axios';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { format } from 'date-fns';

import { useParams, useHistory } from 'react-router-dom';

import {
  FaCalendarDay,
  FaSort,
  FaUserAlt,
  FaCity,
  FaFlag,
  FaHome,
} from 'react-icons/fa';
import BasePage from '../../../components/BasePage';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import DatePicker from '../../../components/DatePicker';
import api from '../../../services/api';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import Loading from '../../../components/Loading';
import { ArroundButton } from './styles';
import { UFData, CityData, UFRes, CityRes } from '../../../utils/interfaces';

interface params {
  id: string;
}

interface OptionsDataSessionTypes {
  id: string;
  description: string;
  type: string;
  degree: {
    description: string;
  };
  value: string;
  label: string;
}

interface Obreiro {
  id: string;
  name: string;
  value: string;
  label: string;
}

interface SelectData {
  value?: string | number | undefined | null;
  label?: string;
}

interface SessionVisitFormData {
  obreiro_id: SelectData;
  session_type_id: SelectData;
  date: Date | null;
  loja: string;
  oriente_uf_id: SelectData;
  oriente_city_id: SelectData;
}

interface DataForm {
  obreiro_id: string;
  session_type_id: string;
  date: string;
  loja: string;
  oriente_uf?: string;
  oriente_uf_id: number;
  oriente_city?: string;
  oriente_city_id: number;
}

const SessionVisit: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [editSessionVisit, setEditSessionVisit] = useState<
    SessionVisitFormData | undefined
  >();
  const [saveLoading, setSaveLoading] = useState(false);
  const params: params = useParams();
  const [sessionTypes, setSessionTypes] = useState<OptionsDataSessionTypes[]>(
    [],
  );
  const [obreiros, setObreiros] = useState<Obreiro[]>([]);
  const { addToast } = useToast();
  const history = useHistory();
  const [ufsOriente, setUfsOriente] = useState<UFData[]>([]);
  const [citiesOriente, setCitiesOriente] = useState<CityData[]>([]);

  useEffect(() => {
    axios
      .get<UFRes[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then(res => {
        const ufs = res.data.map(uf => {
          const ufData = {
            id: uf.id,
            sigla: uf.sigla,
            value: uf.id,
            label: uf.sigla,
          };

          return ufData;
        });
        ufs.sort((a, b) => {
          // eslint-disable-next-line no-nested-ternary
          return a.sigla > b.sigla ? 1 : b.sigla > a.sigla ? -1 : 0;
        });
        setUfsOriente(ufs);
      });
  }, []);

  const handleChangeUfOriente = useCallback(data => {
    formRef.current?.setFieldValue('naturalness_city_id', '');

    if (data) {
      axios
        .get<CityRes[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.id}/municipios`,
        )
        .then(res => {
          const cities = res.data.map(city => {
            const cityData = {
              id: city.id,
              nome: city.nome,
              value: city.id,
              label: city.nome,
            };

            return cityData;
          });
          setCitiesOriente(cities);
        });
    }
  }, []);

  useEffect(() => {
    api.get('/users/actives').then(response => {
      setObreiros(
        response.data.map((option: Obreiro) => {
          return {
            ...option,
            label: option.name,
            value: option.id,
          };
        }),
      );
    });
  }, []);

  useEffect(() => {
    api.get('/session-types').then(response => {
      setSessionTypes(
        response.data.map((option: OptionsDataSessionTypes) => {
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
      api
        .get(`/session-visits/${params.id}`)
        .then(res => {
          const editSessionVisitForm: SessionVisitFormData = {
            date: new Date(res.data.date),
            obreiro_id: {
              value: res.data.obreiro_id,
              label: res.data.obreiro.name,
            },
            loja: res.data.loja,
            session_type_id: {
              value: res.data.sessionType.id,
              label: res.data.sessionType.description,
            },
            oriente_uf_id: {
              value: res.data.oriente_uf_id,
              label: res.data.oriente_uf,
            },
            oriente_city_id: {
              value: res.data.oriente_city_id,
              label: res.data.oriente_city,
            },
          };

          setEditSessionVisit(editSessionVisitForm);

          axios
            .get<CityRes[]>(
              `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${editSessionVisitForm.oriente_uf_id.value}/municipios`,
            )
            .then(data => {
              const cities = data.data.map(city => {
                const cityData = {
                  id: city.id,
                  nome: city.nome,
                  value: city.id,
                  label: city.nome,
                };

                return cityData;
              });
              setCitiesOriente(cities);
            });
          setEditSessionVisit(editSessionVisitForm);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          obreiro_id: Yup.string().required('Obreiro é obrigatório'),
          date: Yup.string().nullable().required('Data é obrigatório'),
          session_type_id: Yup.string().required(
            'Tipo de sessão é obrigatório',
          ),
          loja: Yup.string().required('Loja é obrigatório'),
          oriente_uf_id: Yup.string().required('UF do Oriente é obrigatório'),
          oriente_city_id: Yup.string().required(
            'Cidade do Oriente é obrigatório',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setSaveLoading(true);
        const {
          obreiro_id,
          session_type_id,
          date,
          loja,
          oriente_uf_id,
          oriente_city_id,
        } = data;

        const dataForm: DataForm = {
          obreiro_id,
          session_type_id,
          date: format(new Date(date), 'yyyy-MM-dd'),
          loja,
          oriente_city: citiesOriente.find(
            citySelect => citySelect.id === oriente_city_id,
          )?.nome,
          oriente_city_id,
          oriente_uf: ufsOriente.find(ufSelect => ufSelect.id === oriente_uf_id)
            ?.sigla,
          oriente_uf_id,
        };

        if (params.id) {
          await api.put(`/session-visits/${params.id}`, dataForm);
        } else {
          await api.post('/session-visits', dataForm);
        }

        setSaveLoading(false);
        history.push('/app/cad/visitas');
        addToast({
          type: 'success',
          title: 'Visita realizada com sucesso',
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
    [addToast, params.id, history, citiesOriente, ufsOriente],
  );

  return (
    <BasePage
      title={params.id ? 'Editar Visita' : 'Nova Visita'}
      backLink="/app/cad/visitas"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form
            ref={formRef}
            initialData={editSessionVisit}
            onSubmit={handleSubmit}
          >
            <ArroundButton>
              <Button type="submit" disabled={!!saveLoading}>
                {saveLoading ? (
                  <CircularProgress style={{ color: '#FFF' }} />
                ) : (
                  'SALVAR'
                )}
              </Button>
            </ArroundButton>

            <Card title="Lançamento">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Select
                    name="obreiro_id"
                    label="Obreiro"
                    placeholder="Selecione o obreiro"
                    icon={FaUserAlt}
                    options={obreiros}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    name="date"
                    label="Data"
                    dateFormat="dd/MM/yyyy"
                    icon={FaCalendarDay}
                    placeholderText="Selecione a data"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    name="session_type_id"
                    label="Tipo de Sessão"
                    placeholder="Selecione o tipo de sessão"
                    icon={FaSort}
                    options={sessionTypes}
                    isClearable
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Input
                    name="loja"
                    label="Loja"
                    placeholder="Digite a loja"
                    icon={FaHome}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Select
                    name="oriente_uf_id"
                    label="UF do Oriente"
                    icon={FaFlag}
                    options={ufsOriente}
                    onChange={handleChangeUfOriente}
                    placeholder="Selecione a UF"
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Select
                    name="oriente_city_id"
                    label="Cidade do Oriente"
                    icon={FaCity}
                    options={citiesOriente}
                    placeholder="Selecione a cidade"
                    isClearable
                  />
                </Grid>
              </Grid>
            </Card>
          </Form>
        </Container>
      )}
    </BasePage>
  );
};

export default SessionVisit;

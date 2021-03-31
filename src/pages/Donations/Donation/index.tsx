import React, { useState, useRef, useCallback, useEffect } from 'react';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { format } from 'date-fns';

import { useParams, useHistory } from 'react-router-dom';

import { FaCalendarDay, FaSort, FaWallet } from 'react-icons/fa';
import { HiCurrencyDollar } from 'react-icons/hi';
import { FiInfo, FiType } from 'react-icons/fi';
import { RiBankLine } from 'react-icons/ri';
import { MdGroupWork } from 'react-icons/md';
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

interface params {
  id: string;
}

interface SelectData {
  value?: string | number | undefined | null;
  label?: string;
}

interface DonationFormData {
  type_financial_posting_id: SelectData;
  mov: SelectData;
  cost_center_id: SelectData;
  teller_id: SelectData;
  value: number;
  date: Date | null;
  obs: string;
}

interface DataForm {
  type_financial_posting_id: string;
  mov: string;
  date: string;
  value: number;
  cost_center_id: string;
  teller_id: string;
  session_id?: string;
  obs?: string;
}

interface OptionsData {
  id: string;
  description: string;
  type: string;
  value: string;
  label: string;
}

const FinancialPosting: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [editDonation, setEditDonation] = useState<
    DonationFormData | undefined
  >();
  const [saveLoading, setSaveLoading] = useState(false);
  const params: params = useParams();
  const [typesFinancialPostings, setTypesFinancialPostings] = useState<
    OptionsData[]
  >([]);
  const [costCenters, setCostCenters] = useState<OptionsData[]>([]);
  const [tellers, setTellers] = useState<OptionsData[]>([]);
  const [sessions, setSessions] = useState<OptionsData[]>([]);
  const [
    selectedTypeFinancial,
    setSelectedTypeFinancial,
  ] = useState<OptionsData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSession, setSelectedSession] = useState<OptionsData | null>();
  const { addToast } = useToast();
  const history = useHistory();
  const movs = [
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];

  useEffect(() => {
    api.get('/types-financial-postings').then(response => {
      setTypesFinancialPostings(
        response.data.map((option: OptionsData) => {
          return {
            ...option,
            label: option.description,
            value: option.id,
          };
        }),
      );
    });
  }, []);

  useEffect(() => {
    api.get('/cost-centers').then(response => {
      setCostCenters(
        response.data.map((option: OptionsData) => {
          return {
            ...option,
            label: option.description,
            value: option.id,
          };
        }),
      );
    });
  }, []);

  useEffect(() => {
    api
      .get('/sessions/day', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setSelectedSession(null);
        setSessions(
          response.data.map((option: any) => {
            return {
              ...option,
              label: `${option.number} - ${option.session_type.description}`,
              value: option.id,
            };
          }),
        );
      });
  }, [selectedDate]);

  useEffect(() => {
    const type_post = formRef.current?.getFieldRef('type_financial_posting_id')
      ?.state?.value;
    const date = formRef.current?.getFieldValue('date') as Date;
    const session = formRef.current?.getFieldRef('session_id')?.state?.value;
    let obs = ``;

    if (type_post) {
      obs += `${type_post.label} `;
    }
    if (date) {
      obs += `${date.toLocaleDateString()} `;
    }
    if (session) {
      obs += `Sessão ${session.label} `;
    }

    formRef.current?.setFieldValue('obs', obs);
  }, [selectedTypeFinancial, selectedDate, selectedSession]);

  const handleChangeSelectedDate = useCallback(
    (date: Date) => {
      if (date) {
        setSelectedDate(date);
        formRef.current?.setFieldValue('session_id', null);
        setSelectedSession(null);
      }
    },
    [setSelectedDate, setSelectedSession],
  );

  const handleChangeCostCenter = useCallback(data => {
    formRef.current?.setFieldValue('teller_id', '');
    api.get(`/tellers/cost-center/${data.id}`).then(response => {
      setTellers(
        response.data
          .map((option: OptionsData) => {
            return {
              ...option,
              label: option.description,
              value: option.id,
            };
          })
          .filter((cv: any) => cv?.trunk),
      );
    });
  }, []);

  const handleChangeTypeFinancialPosting = useCallback(
    data => {
      setSelectedTypeFinancial(data);
      const typeFind = typesFinancialPostings.find(
        type => type?.id === data?.id,
      )?.type;

      formRef.current?.setFieldValue('mov', {
        label: typeFind,
        value: typeFind,
      });
    },
    [typesFinancialPostings],
  );

  // ANCHOR handleSelectSession
  const handleSelectSession = useCallback((value: any) => {
    setSelectedSession(value);
  }, []);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api
        .get(`/financial-postings/${params.id}`)
        .then(res => {
          const editDonationCreated: DonationFormData = {
            cost_center_id: {
              value: res.data.cost_center_id,
              label: res.data.costCenter.description,
            },
            date: res.data.date ? new Date(res.data.date) : null,
            mov: {
              value: res.data.mov,
              label: res.data.mov,
            },
            teller_id: {
              value: res.data.teller_id,
              label: res.data.teller.description,
            },
            type_financial_posting_id: {
              value: res.data.type_financial_posting_id,
              label: res.data.typeFinancialPosting.description,
            },
            obs: res.data.obs,
            value: res.data.value,
          };

          api
            .get(
              `/tellers/cost-center/${editDonationCreated.cost_center_id.value}`,
            )
            .then(response => {
              setTellers(
                response.data.map((option: OptionsData) => {
                  return {
                    ...option,
                    label: option.description,
                    value: option.id,
                  };
                }),
              );
            });

          setEditDonation(editDonationCreated);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  // ANCHOR handleSubmit
  const handleSubmit = useCallback(
    async data => {
      // console.log(data);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          type_financial_posting_id: Yup.string().required(
            'Tipo de lançamento é obrigatório',
          ),
          mov: Yup.string().required('Mov. é obrigatório'),
          date: Yup.string().nullable().required('Data é obrigatório'),
          value: Yup.number()
            .transform((v, o) => (o === '' ? null : v))
            .nullable()
            .required('Valor é obrigatório'),
          cost_center_id: Yup.string().required(
            'Centro de Custo é obrigatório',
          ),
          teller_id: Yup.string().required('Caixa é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setSaveLoading(true);
        const {
          type_financial_posting_id,
          mov,
          date,
          value,
          cost_center_id,
          teller_id,
          session_id,
          obs,
        } = data;

        const dataForm: DataForm = {
          type_financial_posting_id,
          mov,
          date: format(new Date(date), 'yyyy-MM-dd'),
          value,
          cost_center_id,
          teller_id,
          session_id,
          obs,
        };

        // console.log(dataForm);
        if (params.id) {
          await api.put(`/donations/${params.id}`, dataForm);
        } else {
          await api.post('/donations', dataForm);
        }

        setSaveLoading(false);
        history.push('/app/doacoes');
        addToast({
          type: 'success',
          title: 'Beneficência realizado com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        setSaveLoading(false);

        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, params.id, history],
  );

  // ANCHOR Form
  return (
    <BasePage
      title={params.id ? 'Editar Beneficência' : 'Nova Beneficência'}
      backLink="/app/doacoes"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form
            ref={formRef}
            initialData={editDonation}
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

            <Card title="Beneficência">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Select
                    name="type_financial_posting_id"
                    label="Tipo de Lançamento"
                    placeholder="Selecione o tipo de lançamento"
                    icon={FiType}
                    onChange={handleChangeTypeFinancialPosting}
                    options={typesFinancialPostings}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Select
                    name="mov"
                    label="Mov."
                    icon={FaSort}
                    placeholder="Selecione..."
                    options={movs}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    name="date"
                    label="Data"
                    dateFormat="dd/MM/yyyy"
                    timeCaption="Horário"
                    icon={FaCalendarDay}
                    placeholderText="Selecione a data"
                    selected={selectedDate}
                    changeHandler={handleChangeSelectedDate}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Input
                    name="value"
                    label="Valor"
                    icon={HiCurrencyDollar}
                    placeholder="Digite o valor"
                    type="number"
                    step={0.01}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Select
                    name="cost_center_id"
                    label="Centro de Custo"
                    placeholder="Selecione o centro de custo"
                    icon={RiBankLine}
                    options={costCenters}
                    onChange={handleChangeCostCenter}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    name="teller_id"
                    label="Caixa"
                    placeholder="Selecione o caixa"
                    icon={FaWallet}
                    options={tellers}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    name="session_id"
                    label="Sessão"
                    placeholder="Selecione a sessão"
                    icon={MdGroupWork}
                    options={sessions}
                    value={selectedSession}
                    onChange={handleSelectSession}
                    isClearable
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Input
                    name="obs"
                    label="Observação"
                    placeholder="Digite a observação"
                    icon={FiInfo}
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

export default FinancialPosting;

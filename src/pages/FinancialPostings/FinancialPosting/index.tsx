import React, { useState, useRef, useCallback, useEffect } from 'react';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { format } from 'date-fns';

import { useParams, useHistory } from 'react-router-dom';

import { FaCalendarDay, FaSort, FaUserAlt, FaWallet } from 'react-icons/fa';
import { HiCurrencyDollar } from 'react-icons/hi';
import { FiInfo, FiType } from 'react-icons/fi';
import { RiBankLine } from 'react-icons/ri';
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

interface FinancialPostingFormData {
  obreiro_id?: SelectData;
  type_financial_posting_id: SelectData;
  mov: SelectData;
  cost_center_id: SelectData;
  teller_id: SelectData;
  value: number;
  value_after_due: number;
  date: Date | null;
  due_date: Date | null;
  payment_amount: number;
  payday: Date | null;
  obs: string;
  obs_payment: string;
}

interface DataForm {
  type_financial_posting_id: string;
  mov: string;
  date: string;
  value: number;
  value_after_due: number;
  cost_center_id: string;
  teller_id: string;
  due_date: string;
  obreiro_id?: string;
  payment_amount?: number;
  payday?: string;
  obs?: string;
  obs_payment?: string;
}

interface OptionsData {
  id: string;
  description: string;
  type: string;
  default_value?: number;
  default_value_after_due?: number;
  value: string;
  label: string;
}

interface Obreiro {
  id: string;
  name: string;
  value: string;
  label: string;
}

const FinancialPosting: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [editFinancialPosting, setEditFinancialPosting] = useState<
    FinancialPostingFormData | undefined
  >();
  const [saveLoading, setSaveLoading] = useState(false);
  const params: params = useParams();
  const [typesFinancialPostings, setTypesFinancialPostings] = useState<
    OptionsData[]
  >([]);
  const [costCenters, setCostCenters] = useState<OptionsData[]>([]);
  const [obreiros, setObreiros] = useState<Obreiro[]>([]);
  const [tellers, setTellers] = useState<OptionsData[]>([]);
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

  const handleChangeCostCenter = useCallback(data => {
    formRef.current?.setFieldValue('teller_id', '');
    api.get(`/tellers/cost-center/${data.id}`).then(response => {
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
  }, []);

  const handleChangeTypeFinancialPosting = useCallback(
    data => {
      const typeFind = typesFinancialPostings.find(type => type.id === data.id);

      if (typeFind) {
        formRef.current?.setFieldValue('mov', {
          label: typeFind.type,
          value: typeFind.type,
        });
        formRef.current?.setFieldValue('value', typeFind?.default_value);
        // ANCHOR default_value
        formRef.current?.setFieldValue(
          'value_after_due',
          typeFind?.default_value_after_due || typeFind?.default_value,
        );
      }
    },
    [typesFinancialPostings],
  );

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api
        .get(`/financial-postings/${params.id}`)
        .then(res => {
          const editFinancialPostingCreated: FinancialPostingFormData = {
            cost_center_id: {
              value: res.data.cost_center_id,
              label: res.data.costCenter.description,
            },
            date: res.data.date ? new Date(res.data.date) : null,
            due_date: res.data.due_date ? new Date(res.data.due_date) : null,
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
            obs_payment: res.data.obs_payment,
            value: res.data.value,
            value_after_due: res.data.value_after_due,
            payday: res.data.payday ? new Date(res.data.payday) : null,
            payment_amount: res.data.payment_amount,
            obreiro_id: res.data.obreiro
              ? { value: res.data.obreiro_id, label: res.data.obreiro.name }
              : undefined,
          };

          api
            .get(
              `/tellers/cost-center/${editFinancialPostingCreated.cost_center_id.value}`,
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

          setEditFinancialPosting(editFinancialPostingCreated);
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
          type_financial_posting_id: Yup.string().required(
            'Tipo de lançamento é obrigatório',
          ),
          mov: Yup.string().required('Mov. é obrigatório'),
          date: Yup.string().nullable().required('Data é obrigatório'),
          value: Yup.number()
            .transform((v, o) => (o === '' ? null : v))
            .nullable()
            .required('Valor é obrigatório'),
          value_after_due: Yup.number()
            .transform((v, o) => (o === '' ? null : v))
            .nullable(),
          cost_center_id: Yup.string().required(
            'Centro de Custo é obrigatório',
          ),
          teller_id: Yup.string().required('Caixa é obrigatório'),
          due_date: Yup.string().required('Data de vencimento é obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // setSaveLoading(true);
        const {
          type_financial_posting_id,
          mov,
          date,
          value,
          value_after_due,
          cost_center_id,
          teller_id,
          due_date,
          obreiro_id,
          payday,
          payment_amount,
          obs,
          obs_payment,
        } = data;

        const dataForm: DataForm = {
          type_financial_posting_id,
          mov,
          date: format(new Date(date), 'yyyy-MM-dd'),
          value,
          value_after_due: value_after_due || value,
          cost_center_id,
          teller_id,
          due_date: format(new Date(due_date), 'yyyy-MM-dd'),
          obreiro_id: obreiro_id || null,
          payday: payday || null,
          payment_amount: payment_amount || null,
          obs,
          obs_payment,
        };

        if (params.id) {
          await api.put(`/financial-postings/${params.id}`, dataForm);
        } else {
          await api.post('/financial-postings', dataForm);
        }

        setSaveLoading(false);
        history.push('/app/financeiro/lancamentos');
        addToast({
          type: 'success',
          title: 'Lançamento realizado com sucesso',
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
    [addToast, params.id, history],
  );

  return (
    <BasePage
      title={params.id ? 'Editar Lançamento Finan.' : 'Nova Lançamento Finan.'}
      backLink="/app/financeiro/lancamentos"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form
            ref={formRef}
            initialData={editFinancialPosting}
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
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
                  <Select
                    name="teller_id"
                    label="Caixa"
                    placeholder="Selecione o caixa"
                    icon={FaWallet}
                    options={tellers}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    name="due_date"
                    label="Data de Vencimento"
                    dateFormat="dd/MM/yyyy"
                    timeCaption="Horário"
                    icon={FaCalendarDay}
                    placeholderText="Selecione a data"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Input
                    name="value_after_due"
                    label="Valor após Vencimento"
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
                    name="obreiro_id"
                    label="Obreiro"
                    placeholder="Selecione o obreiro"
                    icon={FaUserAlt}
                    options={obreiros}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Input
                    name="payment_amount"
                    label="Valor do pagamento"
                    icon={HiCurrencyDollar}
                    placeholder="Digite o valor do pagamento"
                    type="number"
                    step={0.01}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    name="payday"
                    label="Data do Pagamento"
                    dateFormat="dd/MM/yyyy"
                    timeCaption="Horário"
                    icon={FaCalendarDay}
                    placeholderText="Selecione a data"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Input
                    name="obs"
                    label="Observação"
                    placeholder="Digite a observação"
                    icon={FiInfo}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Input
                    name="obs_payment"
                    label="Observação de Pagamento"
                    placeholder="Digite a observação de pagamento"
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

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
      const typeFind = typesFinancialPostings.find(type => type.id === data.id)
        ?.type;

      formRef.current?.setFieldValue('mov', {
        label: typeFind,
        value: typeFind,
      });
    },
    [typesFinancialPostings],
  );

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
          obs,
        } = data;

        const dataForm: DataForm = {
          type_financial_posting_id,
          mov,
          date: format(new Date(date), 'yyyy-MM-dd'),
          value,
          cost_center_id,
          teller_id,
          obs,
        };

        if (params.id) {
          await api.put(`/donations/${params.id}`, dataForm);
        } else {
          await api.post('/donations', dataForm);
        }

        setSaveLoading(false);
        history.push('/app/doacoes');
        addToast({
          type: 'success',
          title: 'Doação realizado com sucesso',
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
      title={params.id ? 'Editar Doação' : 'Nova Doação'}
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

            <Card title="Doação">
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

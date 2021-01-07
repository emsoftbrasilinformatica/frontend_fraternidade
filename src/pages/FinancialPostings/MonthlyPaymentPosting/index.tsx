import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';

import { Container, CircularProgress, Grid } from '@material-ui/core';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import MaterialTable from 'material-table';
import { FaCalendarDay, FaSort, FaWallet } from 'react-icons/fa';
import { HiCurrencyDollar } from 'react-icons/hi';
import { FiType, FiInfo } from 'react-icons/fi';
import { RiBankLine } from 'react-icons/ri';
import { format, isAfter } from 'date-fns';

import BasePage from '../../../components/BasePage';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import labels from '../../../utils/labels';
import api from '../../../services/api';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import DatePicker from '../../../components/DatePicker';
import Loading from '../../../components/Loading';

interface User {
  id: string;
  name: string;
  cim: number;
  active: boolean;
  degree: {
    description: string;
    order: number;
  };
  tableData: {
    id?: string;
    checked: boolean;
  };
}

interface UserRequest {
  id: string;
}

interface DataForm {
  type_financial_posting_id: string;
  mov: string;
  initial_date: string;
  final_date: string;
  value: number;
  cost_center_id: string;
  teller_id: string;
  obs?: string;
  users: UserRequest[];
}

interface OptionsData {
  id: string;
  description: string;
  type: string;
  default_value?: number;
  value: string;
  label: string;
}

const MonthlyPaymentPosting: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { addToast } = useToast();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [tellers, setTellers] = useState<OptionsData[]>([]);
  const [costCenters, setCostCenters] = useState<OptionsData[]>([]);
  const [typesFinancialPostings, setTypesFinancialPostings] = useState<
    OptionsData[]
  >([]);
  const movs = [{ label: 'D', value: 'D' }];

  useEffect(() => {
    setLoading(true);
    api
      .get<User[]>('/users/actives')
      .then(res => {
        setUsers(
          res.data.map(user => {
            return {
              ...user,
              tableData: { checked: false },
            };
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
        formRef.current?.setFieldValue('value', typeFind?.default_value);
      }
    },
    [typesFinancialPostings],
  );

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          type_financial_posting_id: Yup.string().required(
            'Tipo de lançamento é obrigatório',
          ),
          initial_date: Yup.string()
            .nullable()
            .required('Mês Inicial é obrigatório'),
          final_date: Yup.string()
            .nullable()
            .required('Mês Final é obrigatório'),
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

        const {
          type_financial_posting_id,
          mov,
          initial_date,
          final_date,
          value,
          cost_center_id,
          teller_id,
          obs,
        } = data;

        if (isAfter(new Date(initial_date), new Date(final_date))) {
          addToast({
            type: 'error',
            title: 'Atenção!',
            description: 'Mês Inicial deve ser menor que o Mês Final.',
          });

          return;
        }

        const userToBeSave = users.filter(user => user.tableData.checked);

        if (userToBeSave.length === 0) {
          addToast({
            type: 'error',
            title: 'Atenção!',
            description: 'Selecione ao menos um usuário.',
          });

          return;
        }

        setSaveLoading(true);

        const dataForm: DataForm = {
          type_financial_posting_id,
          mov,
          value,
          cost_center_id,
          teller_id,
          initial_date: format(new Date(initial_date), 'yyyy-MM-dd'),
          final_date: format(new Date(final_date), 'yyyy-MM-dd'),
          obs,
          users: userToBeSave,
        };

        await api.post('/monthly-payments', dataForm);

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
    [addToast, history, users],
  );

  const typesCanBeSelected = useMemo(() => {
    return typesFinancialPostings.filter(type => type.type === 'D');
  }, [typesFinancialPostings]);

  return (
    <BasePage
      title="Carnê de Mensalidade"
      backLink="/app/financeiro/lancamentos"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" disabled={!!saveLoading}>
                {saveLoading ? (
                  <CircularProgress style={{ color: '#FFF' }} />
                ) : (
                  'SALVAR'
                )}
              </Button>
            </div>

            <Card title="Informações">
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Select
                    name="type_financial_posting_id"
                    label="Tipo de Lançamento"
                    placeholder="Selecione o tipo"
                    icon={FiType}
                    onChange={handleChangeTypeFinancialPosting}
                    options={typesCanBeSelected}
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
                    defaultValue={movs[0]}
                    isClearable
                    isDisabled
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <DatePicker
                    name="initial_date"
                    label="Mês Inicial"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    icon={FaCalendarDay}
                    placeholderText="Selecione a data"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <DatePicker
                    name="final_date"
                    label="Mês Final"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
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
                <Grid item xs={12} md={6}>
                  <Input
                    name="obs"
                    label="Observação"
                    placeholder="Digite a observação"
                    icon={FiInfo}
                  />
                </Grid>
              </Grid>

              <MaterialTable
                title=""
                columns={[
                  {
                    title: 'Usuário',
                    field: 'name',
                  },
                  {
                    title: 'CIM',
                    field: 'cim',
                  },
                  {
                    title: 'Grau',
                    field: 'degree.description',
                  },
                ]}
                style={{
                  marginTop: 16,
                  border: '2px solid #0f5e9e',
                }}
                data={users}
                localization={labels.materialTable.localization}
                options={{
                  headerStyle: {
                    zIndex: 0,
                  },
                  selection: true,
                  pageSize: 20,
                }}
              />
            </Card>
          </Form>
        </Container>
      )}
    </BasePage>
  );
};

export default MonthlyPaymentPosting;

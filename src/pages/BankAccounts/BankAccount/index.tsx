/* eslint-disable react/require-default-props */
/* eslint-disable array-callback-return */
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Edit, Delete } from '@material-ui/icons';
import MaterialTable from 'material-table';
import { format } from 'date-fns';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { HiCurrencyDollar } from 'react-icons/hi';
import { MdDescription } from 'react-icons/md';
import BasePage from '../../../components/BasePage';
import Loading from '../../../components/Loading';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import api from '../../../services/api';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import DatePicker from '../../../components/DatePicker';
import Button from '../../../components/Button';
import labels from '../../../utils/labels';
import formatValue from '../../../utils/formatValue';
import { ArroundButton } from './styles';

interface params {
  id: string;
}

interface BankAccountData {
  id?: string;
  description: string;
}

export interface BankAccountValue {
  id?: string;
  amount_account: number;
  amount_invested: number;
  formatted_amount_account?: string;
  formatted_amount_invested?: string;
  date: Date;
  tableData?: TableData;
}

export interface TableData {
  id: number;
}

interface Data {
  description: string;
  bank_account_values: BankAccountValueData[];
}

export interface BankAccountValueData {
  id?: string;
  amount_account: number;
  amount_invested: number;
  date: string;
}

const BankAccount: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [bankAccountEdit, setBankAccountEdit] = useState<BankAccountData>();
  const [bankAccountValues, setBankAccountValues] = useState<
    BankAccountValue[]
  >([]);
  const [idBankAccountValue, setIdBankAccountValue] = useState<number>(-1);
  const params: params = useParams();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setSaveLoading(true);

        const formData: Data = {
          description: data.description,
          bank_account_values: bankAccountValues.map(value => {
            return {
              amount_account: value.amount_account,
              amount_invested: value.amount_invested,
              date: format(new Date(value.date), 'yyyy-MM-dd'),
            };
          }),
        };

        if (params.id) {
          await api.put(`/bank-accounts/${params.id}`, formData);
        } else {
          await api.post('/bank-accounts', formData);
        }

        setSaveLoading(false);
        history.push('/app/financeiro/contas-bancarias');
        addToast({
          type: 'success',
          title: 'Conta Bancária cadastrada com sucesso!',
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
    [addToast, history, params.id, bankAccountValues],
  );

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api
        .get(`/bank-accounts/${params.id}`)
        .then(res => {
          setBankAccountEdit({
            description: res.data.description,
          });

          const bankAccountValuesLoaded: BankAccountValueData[] =
            res.data.bank_account_values;

          setBankAccountValues(
            bankAccountValuesLoaded.map(value => {
              return {
                date: new Date(value.date),
                amount_account: value.amount_account,
                formatted_amount_account: formatValue(value.amount_account),
                amount_invested: value.amount_invested,
                formatted_amount_invested: formatValue(value.amount_invested),
              };
            }),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleEditBankAccountValue = useCallback(rowData => {
    setIdBankAccountValue(rowData.tableData.id);
    formRef.current?.setFieldValue('date', rowData.date);
    formRef.current?.setFieldValue('amount_account', rowData.amount_account);
    formRef.current?.setFieldValue('amount_invested', rowData.amount_invested);
  }, []);

  const handleRemoveBankAccountValue = useCallback(
    rowData => {
      const bankAccountValue = bankAccountValues.find(
        value => value.tableData?.id === rowData.tableData.id,
      );

      if (!bankAccountValue) {
        return;
      }

      const index = bankAccountValues.indexOf(bankAccountValue);

      const bankAccountValuesUpdated: BankAccountValue[] = bankAccountValues.reduce(
        (acc: BankAccountValue[], cv: BankAccountValue, idx, arr) => {
          // err
          if (idx === index) return acc;
          return [...acc, cv];
        },
        [],
      );
      setBankAccountValues(bankAccountValuesUpdated);
    },
    [bankAccountValues],
  );

  const handleAddBankAccountValue = useCallback(() => {
    if (
      formRef.current?.getFieldValue('amount_account') === '' ||
      formRef.current?.getFieldValue('amount_invested') === '' ||
      formRef.current?.getFieldValue('date') === ''
    ) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar registro',
        description: 'Preencha todos os campos para adicionar o registro',
      });
    } else {
      const bankAccountValue: BankAccountValue = {
        amount_account: formRef.current?.getFieldValue('amount_account'),
        amount_invested: formRef.current?.getFieldValue('amount_invested'),
        formatted_amount_account: formatValue(
          Number(formRef.current?.getFieldValue('amount_account')),
        ),
        formatted_amount_invested: formatValue(
          Number(formRef.current?.getFieldValue('amount_invested')),
        ),
        date: formRef.current?.getFieldValue('date'),
      };

      const bankAccountValueExist = bankAccountValues.find(
        value => value.tableData?.id === idBankAccountValue,
      );

      if (bankAccountValueExist) {
        const index = bankAccountValues.indexOf(bankAccountValueExist);
        const bankAccountValuesUpdated: BankAccountValue[] = bankAccountValues.reduce(
          (acc: BankAccountValue[], cv: BankAccountValue, idx, arr) => {
            // err
            if (idx === index) return acc;
            return [...acc, cv];
          },
          [],
        );

        bankAccountValuesUpdated.splice(index, 0, bankAccountValue);
        setBankAccountValues(bankAccountValuesUpdated);
        setIdBankAccountValue(-1);
      } else {
        setBankAccountValues([...bankAccountValues, bankAccountValue]);
      }

      formRef.current?.clearField('amount_account');
      formRef.current?.clearField('amount_invested');
      formRef.current?.clearField('date');
    }
  }, [addToast, bankAccountValues, idBankAccountValue]);

  const bankAccountsOrdered = useMemo(() => {
    return bankAccountValues.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      }
      if (b.date < a.date) {
        return -1;
      }
      return 0;
    });
  }, [bankAccountValues]);

  return (
    <BasePage
      title={params.id ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
      backLink="/app/financeiro/contas-bancarias"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={bankAccountEdit}
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
            <Card title="Conta Bancária">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Input
                    name="description"
                    label="Descrição"
                    icon={MdDescription}
                    placeholder="Digite a descrição"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <DatePicker
                    name="date"
                    label="Mês"
                    icon={MdDescription}
                    placeholderText="Selecione o mês"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Input
                    name="amount_account"
                    label="Valor em conta"
                    icon={HiCurrencyDollar}
                    placeholder="Digite o valor em conta"
                    type="number"
                    step={0.01}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Input
                    name="amount_invested"
                    label="Valor em investimento"
                    icon={HiCurrencyDollar}
                    placeholder="Digite o valor em investimento"
                    type="number"
                    step={0.01}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Button onClick={handleAddBankAccountValue}>Adicionar</Button>
                </Grid>
              </Grid>
              <MaterialTable
                title="Lista de Dependentes"
                localization={labels.materialTable.localization}
                columns={[
                  {
                    title: 'Mês',
                    field: 'date',
                    // type: 'date',
                    render: row => format(new Date(row.date), 'MM/yyyy'),
                  },
                  {
                    title: 'Valor em conta',
                    field: 'formatted_amount_account',
                  },
                  {
                    title: 'Valor em investimento',
                    field: 'formatted_amount_invested',
                  },
                ]}
                data={bankAccountsOrdered}
                options={{
                  headerStyle: {
                    zIndex: 0,
                  },
                }}
                style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
                actions={[
                  rowData => ({
                    icon: () => <Edit />,
                    onClick: () => handleEditBankAccountValue(rowData),
                  }),
                  rowData => ({
                    icon: () => <Delete />,
                    onClick: () => handleRemoveBankAccountValue(rowData),
                  }),
                ]}
              />
            </Card>
          </Form>
        </Container>
      )}
    </BasePage>
  );
};

export default BankAccount;

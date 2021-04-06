import React, { useState, useRef, useCallback, useEffect } from 'react';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import BasePage from '../../../components/BasePage';
import Loading from '../../../components/Loading';
import { useToast } from '../../../hooks/toast';
import { useAuth } from '../../../hooks/auth';
import getValidationErrors from '../../../utils/getValidationErrors';
import api from '../../../services/api';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import { ArroundButton } from './styles';

interface params {
  id: string;
}

interface DataForm {
  description: string;
  default_value: string;
  default_value_after_due: string;
  type: string;
  user_id: string;
}

interface OptionsData {
  id: string;
  description: string;
  value: string;
  label: string;
}

const TypeFinancialPosting: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const params: params = useParams();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();
  const { addToast } = useToast();
  const types = [
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];

  const handleSubmit = useCallback(
    async (data, { reset }, event) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição obrigatória'),
          type: Yup.string().required('Tipo é obrigatório'),
          default_value: Yup.number().required('Valor Padrão é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setSaveLoading(true);

        const {
          description,
          default_value,
          type,
          default_value_after_due,
        } = data;

        const dataForm: DataForm = {
          description,
          default_value,
          type,
          default_value_after_due:
            default_value_after_due !== '' &&
            typeof default_value_after_due !== 'undefined'
              ? default_value_after_due
              : default_value,
          user_id: user.id,
        };

        if (params.id) {
          await api.put(`/types-financial-postings/${params.id}`, dataForm);
        } else {
          await api.post('/types-financial-postings', dataForm);
        }

        setSaveLoading(false);
        history.push('/app/financeiro/tipos-lancamentos');
        addToast({
          type: 'success',
          title: 'Tipo de Lançamento Finan. cadastrado com sucesso!',
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
    [addToast, history, params.id, user.id],
  );

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api.get(`/types-financial-postings/${params.id}`).then(res => {
        setLoading(false);
        formRef.current?.setData({
          description: res.data.description,
          type: {
            value: res.data.type,
            label: res.data.type,
          },
          default_value: res.data.default_value,
          default_value_after_due: res.data.default_value_after_due,
        });
      });
    }
  }, [params.id]);

  return (
    <BasePage
      title={
        params.id
          ? 'Editar Tipo de Lançamento Finan.'
          : 'Novo Tipo de Lançamento Finan.'
      }
      backLink="/app/financeiro/tipos-lancamentos"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <ArroundButton>
              <Button type="submit" disabled={!!saveLoading}>
                {saveLoading ? (
                  <CircularProgress style={{ color: '#FFF' }} />
                ) : (
                  'SALVAR'
                )}
              </Button>
            </ArroundButton>
            <Card title="Tipo de Lançamento Finan.">
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Input
                    name="description"
                    label="Descrição"
                    placeholder="Digite a descrição"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Select
                    name="type"
                    label="Tipo"
                    placeholder="Selecione o tipo"
                    options={types}
                    isClearable
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Input
                    name="default_value"
                    label="Valor Padrão"
                    placeholder="Digite o valor padrão"
                    type="number"
                    step={0.01}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Input
                    name="default_value_after_due"
                    label="Valor Padrão após Vencimento"
                    placeholder="Digite o valor"
                    type="number"
                    step={0.01}
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

export default TypeFinancialPosting;

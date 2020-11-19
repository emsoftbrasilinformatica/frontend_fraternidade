import React, { useState, useRef, useCallback, useEffect } from 'react';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import BasePage from '../../../components/BasePage';
import Loading from '../../../components/Loading';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import api from '../../../services/api';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

interface params {
  id: string;
}

interface DataForm {
  description: string;
}

const TypeFinancialPosting: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editCostCenter, setEditCostCenter] = useState<DataForm | undefined>();
  const params: params = useParams();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data, { reset }, event) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setSaveLoading(true);

        const { description } = data;

        const dataForm: DataForm = {
          description,
        };

        if (params.id) {
          await api.put(`/cost-centers/${params.id}`, dataForm);
        } else {
          await api.post('/cost-centers', dataForm);
        }

        setSaveLoading(false);
        history.push('/app/financeiro/centros-custo');
        addToast({
          type: 'success',
          title: 'Centro de Custo cadastrado com sucesso!',
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
    [addToast, history, params.id],
  );

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api.get(`/cost-centers/${params.id}`).then(res => {
        setLoading(false);
        setEditCostCenter({
          description: res.data.description,
        });
      });
    }
  }, [params.id]);

  return (
    <BasePage
      title={params.id ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
      backLink="/app/financeiro/centros-custo"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Form
            ref={formRef}
            initialData={editCostCenter}
            onSubmit={handleSubmit}
          >
            <Card title="Centro de Custo">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Input
                    name="description"
                    label="Descrição"
                    placeholder="Digite a descrição"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Button type="submit" disabled={!!saveLoading}>
                    {saveLoading ? (
                      <CircularProgress style={{ color: '#FFF' }} />
                    ) : (
                      'SALVAR'
                    )}
                  </Button>
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

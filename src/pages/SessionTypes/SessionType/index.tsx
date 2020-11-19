/* eslint-disable react/require-default-props */
/* eslint-disable array-callback-return */
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
import Select from '../../../components/Select';
import { ArroundButton } from './styles';

interface params {
  id: string;
}

interface DataForm {
  description: string;
  degree_id: string;
  type: string;
}

interface OptionsData {
  id: string;
  description: string;
  value: string;
  label: string;
}

const SessionType: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const params: params = useParams();
  const [degrees, setDegrees] = useState<OptionsData[]>([]);
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const types = [
    { label: 'Magna', value: 'Magna' },
    { label: 'Ordinária', value: 'Ordinária' },
    { label: 'Pública', value: 'Pública' },
  ];

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição obrigatória'),
          degree: Yup.string().required('Grau é obrigatório'),
          type: Yup.string().required('Tipo é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setSaveLoading(true);

        const { description, degree, type } = data;

        const dataForm: DataForm = {
          description,
          degree_id: degree,
          type,
        };

        if (params.id) {
          await api.put(`/session-types/${params.id}`, dataForm);
        } else {
          await api.post('/session-types', dataForm);
        }

        setSaveLoading(false);
        history.push('/app/cad/tipos-sessao');
        addToast({
          type: 'success',
          title: 'Tipo de sessão cadastrado com sucesso!',
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
      api.get(`/session-types/${params.id}`).then(res => {
        setLoading(false);
        formRef.current?.setData({
          degree: {
            value: res.data.degree_id,
            label: res.data.degree.description,
          },
          description: res.data.description,
          type: {
            value: res.data.type,
            label: res.data.type,
          },
        });
      });
    }
  }, [params.id]);

  useEffect(() => {
    api.get('/degrees').then(response => {
      const options: OptionsData[] = response.data;
      options.map(opt => {
        opt.label = opt.description;
        opt.value = opt.id;
      });
      setDegrees(options);
    });
  }, []);

  return (
    <BasePage
      title={params.id ? 'Editar Tipo de Sessão' : 'Novo Tipo de Sessão'}
      backLink="/app/cad/tipos-sessao"
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
            <Card title="Tipo de Sessão">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Input
                    name="description"
                    label="Descrição"
                    placeholder="Digite a descrição"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    name="type"
                    label="Tipo"
                    placeholder="Selecione o tipo"
                    options={types}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    name="degree"
                    label="Grau"
                    placeholder="Selecione o grau"
                    options={degrees}
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

export default SessionType;

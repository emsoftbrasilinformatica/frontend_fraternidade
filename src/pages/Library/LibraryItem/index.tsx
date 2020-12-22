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
import { useAuth } from '../../../hooks/auth';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import api from '../../../services/api';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import InputFile from '../../../components/InputFile';
import { ArroundButton } from './styles';

interface params {
  id: string;
}

interface Work {
  id?: string;
  description: string;
  degree: SelectData;
  file: File;
}

interface SelectData {
  value?: string | number | undefined | null;
  label?: string;
}

interface OptionsData {
  id: string;
  description: string;
  value: string;
  label: string;
}

const LibraryItem: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const params: params = useParams();
  const [degrees, setDegrees] = useState<OptionsData[]>([]);
  const history = useHistory();
  // const [selectedFile, setSelectedFile] = useState<File>();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().required('Descrição obrigatória'),
          degree: Yup.string().required('Grau é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (!data.file) {
          addToast({
            type: 'error',
            title: 'Selecione um arquivo!',
          });
          return;
        }

        if (data.file.size > 10000 * 1024) {
          addToast({
            type: 'error',
            title: 'Arquivo não suportado!',
            description: 'Arquivo acima do limite permitido de 10.0MB',
          });
          return;
        }

        setSaveLoading(true);

        const formData = new FormData();

        const { description, degree, file } = data;

        formData.append('user_id', user.id);
        formData.append('description', description);
        formData.append('degree_id', degree);
        formData.append('file', file);

        if (params.id) {
          await api.put(`/works/${params.id}`, formData);
        } else {
          await api.post('/works', formData);
        }

        setSaveLoading(false);
        history.push('/app/cad/bibliotecas');
        addToast({
          type: 'success',
          title: 'Item cadastrado com sucesso!',
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
      api
        .get(`/works/${params.id}`)
        .then(res => {
          let fileCreated: File;
          fetch(res.data.file_url)
            .then(response => response.blob())
            .then(blob => {
              const nameFile: string = res.data.file;
              const nameEditted = nameFile.slice(
                nameFile.indexOf('-') + 1,
                nameFile.length,
              );
              fileCreated = new File([blob], nameEditted);
              formRef.current?.setData({
                degree: {
                  value: res.data.degree_id,
                  label: res.data.degree.description,
                },
                description: res.data.description,
                file: fileCreated,
              });
            });
        })
        .finally(() => {
          setLoading(false);
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
      title={params.id ? 'Editar Item' : 'Novo Item'}
      backLink="/app/cad/bibliotecas"
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
            <Card title="Item de biblioteca">
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
                    name="degree"
                    label="Grau"
                    placeholder="Selecione o grau"
                    options={degrees}
                    isClearable
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <InputFile label="Selecione o arquivo" name="file" />
                </Grid>
              </Grid>
            </Card>
          </Form>
        </Container>
      )}
    </BasePage>
  );
};

export default LibraryItem;

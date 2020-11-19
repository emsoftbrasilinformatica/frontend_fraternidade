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
import InputFile from '../../../components/InputFile';
import { ArroundButton } from './styles';

interface params {
  id: string;
}

interface Upload {
  id?: string;
  description: string;
  file: File;
}

const Upload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const params: params = useParams();
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

        setSaveLoading(true);

        const formData = new FormData();

        const { description, file } = data;

        formData.append('user_id', user.id);
        if (user.administrative_function?.id) {
          formData.append(
            'administrative_function_id',
            user.administrative_function?.id,
          );
        }
        formData.append('description', description);
        formData.append('file', file);

        if (params.id) {
          await api.put(`/uploads/${params.id}`, formData);
        } else {
          await api.post('/uploads', formData);
        }

        setSaveLoading(false);
        history.push('/app/cad/uploads');
        addToast({
          type: 'success',
          title: 'Upload cadastrada com sucesso!',
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
    [addToast, history, params.id, user.id, user.administrative_function],
  );

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api
        .get(`/uploads/${params.id}`)
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

  return (
    <BasePage
      title={params.id ? 'Editar Upload' : 'Novo Upload'}
      backLink="/app/cad/uploads"
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
            <Card title="Upload">
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

export default Upload;

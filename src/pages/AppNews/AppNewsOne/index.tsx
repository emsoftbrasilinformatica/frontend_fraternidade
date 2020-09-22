import React, { useState, useRef, useCallback, useEffect } from 'react';

import * as Yup from 'yup';

import { Container, Grid } from '@material-ui/core';
import { MdTitle, MdSubtitles } from 'react-icons/md';
import { BiBookContent } from 'react-icons/bi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useParams, useHistory } from 'react-router-dom';
import BasePage from '../../../components/BasePage';
import Card from '../../../components/Card';
import Dropzone from '../../../components/Dropzone';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import api from '../../../services/api';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import { useAuth } from '../../../hooks/auth';
import Loading from '../../../components/Loading';

interface News {
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
}

interface params {
  id: string;
}

const AppNewsOne: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [editNews, setEditNews] = useState<News | undefined>();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { user } = useAuth();
  const history = useHistory();
  const params: params = useParams();

  const handleSubmit = useCallback(
    async (data: News) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Título obrigatória'),
          subtitle: Yup.string().required('Subtítulo é obrigatório'),
          content: Yup.string().required('Conteúdo é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (!selectedFile) {
          addToast({
            type: 'error',
            title: 'Selecione uma imagem para a notícia!',
          });
          return;
        }

        setLoading(true);

        const formData = new FormData();

        const { content, title, subtitle } = data;

        formData.append('user_id', user.id);
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('content', content);
        formData.append('image', selectedFile);

        if (params.id) {
          await api.put(`/news/${params.id}`, formData);
        } else {
          await api.post('/news', formData);
        }

        setLoading(false);
        history.push('/app/noticias');
        addToast({
          type: 'success',
          title: 'Notícia cadastrada com sucesso!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        setLoading(false);
        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, selectedFile, user.id, history, params.id],
  );

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api.get(`/news/show/${params.id}`).then(res => {
        const news: News = res.data;
        setEditNews(news);

        fetch(news.image_url)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], 'teste');
            setSelectedFile(file);
            setLoading(false);
          });
      });
    }
  }, [params.id]);

  return (
    <BasePage
      title={params.id ? 'Editar Notícia' : 'Nova Notícia'}
      backLink="/app/noticias"
    >
      {loading ? (
        <Loading />
      ) : (
        <Container style={{ marginTop: 32 }}>
          <Card title="Notícia">
            <Form ref={formRef} initialData={editNews} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Dropzone
                    onFileUploaded={setSelectedFile}
                    initialFile={selectedFile}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid item md={12}>
                    <Input
                      name="title"
                      icon={MdTitle}
                      label="Título"
                      placeholder="Digite o título da notícia"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Input
                      multiline
                      name="subtitle"
                      icon={MdSubtitles}
                      placeholder="Digite o subtítulo da notícia"
                      label="Subtítulo"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Input
                      multiline
                      heigth={200}
                      icon={BiBookContent}
                      placeholder="Digite o conteúdo da notícia"
                      name="content"
                      label="Conteúdo"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Button type="submit">SALVAR</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          </Card>
        </Container>
      )}
    </BasePage>
  );
};

export default AppNewsOne;

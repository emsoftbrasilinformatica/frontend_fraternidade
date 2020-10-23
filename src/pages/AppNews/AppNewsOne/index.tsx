import React, { useState, useRef, useCallback, useEffect } from 'react';

import * as Yup from 'yup';
import { shade } from 'polished';

import ImageUploading, { ImageListType } from 'react-images-uploading';
import Resizer from 'react-image-file-resizer';

import { CircularProgress, Container, Grid } from '@material-ui/core';
import { MdTitle, MdSubtitles } from 'react-icons/md';
import { BiBookContent } from 'react-icons/bi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useParams, useHistory } from 'react-router-dom';
import { FaCalendarDay, FaTrash, FaUpload } from 'react-icons/fa';
import { format } from 'date-fns';
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
import LoadingLocale from '../../../components/LoadingLocale';
import DatePicker from '../../../components/DatePicker';

import {
  AddImages,
  RemoveAllImages,
  ContainerButtons,
  ContainerListImage,
  ItemImage,
  Image,
  ButtonUpdateImage,
  ButtonRemoveImage,
} from './styles';

interface News {
  title: string;
  subtitle: string;
  content: string;
  image: string;
  image_url: string;
  newsImages: NewsImages[];
  date: Date;
}

interface NewsImages {
  image: string;
  image_url: string;
}

interface params {
  id: string;
}

const AppNewsOne: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [images, setImages] = useState<ImageListType>([]);
  const maxNumber = 69;
  const [editNews, setEditNews] = useState<News | undefined>();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { user } = useAuth();
  const history = useHistory();
  const params: params = useParams();
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  const resizeFile = (file: File): Promise<string> =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file,
        850,
        850,
        'JPEG',
        90,
        0,
        uri => {
          resolve(uri as string);
        },
        'base64',
      );
    });

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, [height, width]);

  const onChangeImages = useCallback(
    async (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
      setLoadingImages(true);
      setImages([]);
      if (imageList) {
        const imagesResized = imageList.map(async resized => {
          if (resized.file) {
            const imageResized = await resizeFile(resized.file);
            return imageResized;
          }
          return '';
        });

        const resizedImages = await Promise.all(imagesResized);

        resizedImages.forEach(image => {
          fetch(image)
            .then(response => response.blob())
            .then(blob => {
              const file = new File([blob], 'imagenews.jpeg', {
                type: 'image/jpeg',
              });
              const imageCreated = {
                dataURL: image,
                file,
              };

              setImages(i => {
                return [...i, imageCreated];
              });
            });
        });
      }
      setLoadingImages(false);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (data: News) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          title: Yup.string().required('Título obrigatória'),
          date: Yup.string().nullable().required('Data é obrigatória'),
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

        setSaveLoading(true);

        const formData = new FormData();

        const { content, title, subtitle } = data;

        formData.append('user_id', user.id);
        formData.append('title', title);
        formData.append(
          'date',
          format(new Date(data.date), 'yyyy-MM-dd HH:mm'),
        );
        formData.append('subtitle', subtitle);
        formData.append('content', content);
        formData.append('image', selectedFile);

        if (images.length > 0) {
          images.forEach(image => {
            if (image.file) {
              formData.append('images', image.file);
            }
          });
        }

        if (params.id) {
          await api.put(`/news/${params.id}`, formData);
        } else {
          await api.post('/news', formData);
        }

        setSaveLoading(false);
        history.push('/app/cad/noticias');
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
        setSaveLoading(false);
        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, selectedFile, user.id, history, params.id, images],
  );

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      api.get(`/news/show/${params.id}`).then(res => {
        const news: News = res.data;
        setEditNews({
          ...news,
          date: new Date(news.date),
        });

        fetch(news.image_url)
          .then(response => response.blob())
          .then(blob => {
            const nameFile: string = news.image;
            const nameEditted = nameFile.slice(
              nameFile.indexOf('-') + 1,
              nameFile.length,
            );
            const file = new File([blob], nameEditted);
            setSelectedFile(file);
            setLoading(false);
          });
      });
    }
  }, [params.id]);

  useEffect(() => {
    async function generateImages(): Promise<void> {
      editNews?.newsImages.map(image => {
        fetch(image.image_url)
          .then(response => response.blob())
          .then(blob => {
            const nameFile: string = image.image;
            const nameEditted = nameFile.slice(
              nameFile.indexOf('-') + 1,
              nameFile.length,
            );
            const file = new File([blob], nameEditted);
            const url = URL.createObjectURL(file);
            const imageCreated = {
              dataURL: url,
              file,
            };

            setImages(i => {
              return [...i, imageCreated];
            });
          });
      });
    }

    generateImages();
  }, [editNews]);

  return (
    <BasePage
      title={params.id ? 'Editar Notícia' : 'Nova Notícia'}
      backLink="/app/cad/noticias"
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
                  direction={width >= 960 ? 'column' : 'column-reverse'}
                  style={{
                    display: 'flex',
                  }}
                >
                  <Grid item md={12} style={{ flexBasis: 0 }}>
                    <Input
                      name="title"
                      icon={MdTitle}
                      label="Título"
                      placeholder="Digite o título da notícia"
                    />
                    <DatePicker
                      name="date"
                      label="Data"
                      dateFormat="dd/MM/yyyy"
                      icon={FaCalendarDay}
                      placeholderText="Selecione a data"
                    />
                  </Grid>
                  {/* <Grid item md={12} style={{ flexBasis: 0 }}>

                  </Grid> */}
                  <Grid
                    item
                    md={12}
                    style={{
                      flexBasis: 0,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Dropzone
                      onFileUploaded={setSelectedFile}
                      initialFile={selectedFile}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
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
                  <ImageUploading
                    multiple
                    value={images}
                    onChange={onChangeImages}
                    maxNumber={maxNumber}
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => (
                      // write your building UI
                      <div
                        style={{ marginTop: 16, marginBottom: 16 }}
                        className="upload__image-wrapper"
                      >
                        <ContainerButtons container spacing={2}>
                          <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                            <AddImages
                              style={
                                isDragging
                                  ? { backgroundColor: shade(0.2, '#6b9ec7') }
                                  : undefined
                              }
                              onClick={onImageUpload}
                              {...dragProps}
                              type="button"
                            >
                              <FaUpload />
                              Selecione ou arraste as imagens
                            </AddImages>
                          </Grid>
                          <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                            <RemoveAllImages
                              onClick={onImageRemoveAll}
                              type="button"
                            >
                              <FaTrash />
                              Remover imagens
                            </RemoveAllImages>
                          </Grid>
                        </ContainerButtons>
                        <Grid
                          container
                          spacing={2}
                          style={
                            loadingImages
                              ? { display: 'flex', justifyContent: 'center' }
                              : {}
                          }
                        >
                          {loadingImages ? (
                            <LoadingLocale />
                          ) : (
                            imageList.map((image, index) => (
                              <ContainerListImage
                                item
                                xs={12}
                                md={4}
                                key={index}
                                className="image-item"
                              >
                                <ItemImage>
                                  <Image imageURL={image.dataURL} />
                                  <Grid
                                    container
                                    spacing={2}
                                    style={{ padding: 10 }}
                                  >
                                    <Grid
                                      item
                                      xs={12}
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <ButtonUpdateImage
                                        onClick={() => onImageUpdate(index)}
                                        type="button"
                                      >
                                        Atualizar
                                      </ButtonUpdateImage>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <ButtonRemoveImage
                                        onClick={() => onImageRemove(index)}
                                        type="button"
                                      >
                                        Remover
                                      </ButtonRemoveImage>
                                    </Grid>
                                  </Grid>
                                </ItemImage>
                              </ContainerListImage>
                            ))
                          )}
                        </Grid>
                      </div>
                    )}
                  </ImageUploading>
                  <Grid item md={12}>
                    <Button type="submit" disabled={!!saveLoading}>
                      {saveLoading ? (
                        <CircularProgress style={{ color: '#FFF' }} />
                      ) : (
                        'SALVAR'
                      )}
                    </Button>
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

import React, { useState, useRef, useCallback, useEffect } from 'react';

import * as Yup from 'yup';

import { uuid } from 'uuidv4';
import { useDropzone } from 'react-dropzone';
import Resizer from 'react-image-file-resizer';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  Container,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Divider,
} from '@material-ui/core';
import { MdTitle, MdSubtitles } from 'react-icons/md';
import { BiBookContent } from 'react-icons/bi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useParams, useHistory } from 'react-router-dom';
import { FaCalendarDay, FaImage } from 'react-icons/fa';
import { format } from 'date-fns';
import { FiUpload } from 'react-icons/fi';
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
  ButtonRemove,
  ContainerDropzone,
  Img,
  Thumb,
  ThumbInner,
  ThumbsContainer,
  ButtonRemoveAll,
  ContainerImgDialog,
  ImgDialog,
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

interface FileDropzone extends File {
  preview: string;
  id: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalTitle: {
      background: '#0f5e9e',
      color: '#FFF',
      flex: '0 0 auto',
      margin: 0,
      padding: '9px 24px',
      textAlign: 'center',
    },
    modalContent: {
      margin: '15px 0',
      fontWeight: 'bold',
    },
    iconDialog: {
      marginRight: 8,
    },
  }),
);

const AppNewsOne: React.FC = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [images, setImages] = useState<FileDropzone[]>([]);
  const [imageDialog, setImageDialog] = useState<FileDropzone>();
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
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleClickOpen = (id: string): void => {
    const imageFind = images.find(image => image.id === id);
    setImageDialog(imageFind);
    setOpenDialog(true);
  };

  const handleClose = (): void => {
    setOpenDialog(false);
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, [height, width]);

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
            if (image) {
              formData.append('images', image);
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
            const fileCreated: FileDropzone = Object.assign(file, {
              preview: URL.createObjectURL(file),
              id: uuid(),
            });

            setImages(i => {
              return [...i, fileCreated];
            });
          });
      });
    }

    generateImages();
  }, [editNews]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: async acceptedFiles => {
      if (acceptedFiles) {
        setLoadingImages(true);
        const imagesResized = acceptedFiles.map(async resized => {
          if (resized) {
            const imageResized = await resizeFile(resized);
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
              const fileCreated: FileDropzone = Object.assign(file, {
                preview: URL.createObjectURL(file),
                id: uuid(),
              });

              setImages(i => {
                return [...i, fileCreated];
              });
            });
        });
        setLoadingImages(false);
      }
    },
  });

  const handleRemoveImage = useCallback(
    id => {
      const updatedImages = images.filter(file => file.id !== id);

      setImages(updatedImages);
    },
    [images],
  );

  const handleRemoveAllImages = useCallback(() => {
    setImages([]);
  }, []);

  const thumbs = images.map(image => (
    <Thumb key={image.id}>
      <ThumbInner>
        <Img src={image.preview} onClick={() => handleClickOpen(image.id)} />
      </ThumbInner>
      <ButtonRemove type="button" onClick={() => handleRemoveImage(image.id)}>
        Remover
      </ButtonRemove>
    </Thumb>
  ));

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
                  <Grid item md={12}>
                    {loadingImages ? (
                      <LoadingLocale />
                    ) : (
                      <ContainerDropzone>
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <p>
                            <FiUpload />
                            Selecione os arquivos ou arraste
                          </p>
                        </div>
                        <ButtonRemoveAll
                          type="button"
                          onClick={handleRemoveAllImages}
                        >
                          Remover todas
                        </ButtonRemoveAll>
                        <ThumbsContainer>{thumbs}</ThumbsContainer>
                      </ContainerDropzone>
                    )}
                  </Grid>
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
          <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
              <FaImage className={classes.iconDialog} />
              Preview da Imagem
            </DialogTitle>
            <Divider />
            <DialogContent>
              <DialogContentText
                className={classes.modalContent}
                id="alert-dialog-description"
              >
                <ContainerImgDialog>
                  <ImgDialog image={imageDialog ? imageDialog.preview : ''} />
                </ContainerImgDialog>
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button onClick={handleClose} className="buttonCancel">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </BasePage>
  );
};

export default AppNewsOne;

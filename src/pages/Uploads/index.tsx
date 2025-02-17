import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button as ButtonMT,
  Divider,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import { Edit, AddCircle, Delete } from '@material-ui/icons';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import { Button, ArroundButton } from './styles';

import BasePage from '../../components/BasePage';
import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';
import { useToast } from '../../hooks/toast';

import { useAuth } from '../../hooks/auth';

interface Upload {
  id: string;
  description: string;
  file: string;
  file_url: string;
  administrative_function: {
    description: string;
  };
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
    modalActions: {
      background: '#0f5e9e',
    },
    nested: {
      paddingLeft: theme.spacing(4),
      borderBottom: '1px solid #e0e0e0',
    },
  }),
);

const Uploads: React.FC = () => {
  const [data, setData] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();
  const history = useHistory();
  const classes = useStyles();
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    let url;
    if (user.administrative_function?.description === 'Venerável') {
      url = '/uploads';
    } else {
      url = `/uploads/administrative_function/${user.administrative_function?.id}`;
    }
    api
      .get(url)
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user.administrative_function]);

  const editUpload = useCallback(
    rowData => {
      history.push(`upload/${rowData.id}`);
    },
    [history],
  );

  const deleteUpload = useCallback((rowData: any): void => {
    setIdToBeDeleted(rowData.id);
    setOpenDialog(true);
  }, []);

  const generateDownload = useCallback((rowData: any): void => {
    const element = document.createElement('a');
    element.href = rowData.file_url;
    element.download = rowData.file;
    element.target = '_blank';
    element.click();
  }, []);

  const handleAddUpload = useCallback(() => {
    history.push('upload');
  }, [history]);

  const handleClose = useCallback((): void => {
    setOpenDialog(false);
  }, []);

  const handleDeleteUpload = useCallback(async () => {
    setOpenDialog(false);
    setLoading(true);
    const res = await api.delete(`/uploads/${idToBeDeleted}`);

    if (res.status === 204) {
      const uploadsUpdated = data.filter(upload => upload.id !== idToBeDeleted);

      setData(uploadsUpdated);
      setLoading(false);
      setIdToBeDeleted('');
      addToast({
        type: 'success',
        title: 'Upload excluído com sucesso',
      });
    } else {
      setLoading(false);
      addToast({
        type: 'error',
        title: 'Falha ao excluir upload, tente novamente.',
      });
    }
  }, [idToBeDeleted, addToast, data]);

  return (
    <BasePage title="Uploads">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <ArroundButton>
              <Button type="button" onClick={handleAddUpload}>
                Adicionar Upload
                <AddCircle style={{ color: '#0f5e9e' }} />
              </Button>
            </ArroundButton>
            <MaterialTable
              title="Listagem de Uploads"
              localization={labels.materialTable.localization}
              columns={[
                { title: 'Descriçao', field: 'description' },
                {
                  title: 'Função Administrativa',
                  field: 'administrative_function.description',
                },
              ]}
              data={[...data]}
              style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
              actions={[
                rowData => ({
                  icon: () => <FaDownload style={{ color: '#25b922' }} />,
                  onClick: () => generateDownload(rowData),
                  tooltip: 'Download',
                }),
                rowData => ({
                  icon: () => <Edit style={{ color: '#1976d2' }} />,
                  onClick: () => editUpload(rowData),
                  tooltip: 'Editar',
                }),
                rowData => ({
                  icon: () => <Delete style={{ color: '#c53030' }} />,
                  onClick: () => deleteUpload(rowData),
                  tooltip: 'Excluir',
                }),
              ]}
            />
          </Container>
          <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
              <FaExclamationTriangle className={classes.iconDialog} />
              Atenção
            </DialogTitle>
            <Divider />
            <DialogContent>
              <DialogContentText
                className={classes.modalContent}
                id="alert-dialog-description"
              >
                Deseja realmente excluir o upload?
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
              <ButtonMT onClick={handleClose} className="buttonCancel">
                Cancelar
              </ButtonMT>
              <ButtonMT
                className="buttonConfirm"
                onClick={handleDeleteUpload}
                autoFocus
              >
                Confirmar
              </ButtonMT>
            </DialogActions>
          </Dialog>
        </>
      )}
    </BasePage>
  );
};

export default Uploads;

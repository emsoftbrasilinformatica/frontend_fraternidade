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
import { FaExclamationTriangle } from 'react-icons/fa';
import { Edit, AddCircle, Delete } from '@material-ui/icons';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import { Button, ArroundButton } from './styles';

import BasePage from '../../components/BasePage';
import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';
import { useToast } from '../../hooks/toast';

interface Work {
  id: string;
  description: string;
  degree: {
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

const Works: React.FC = () => {
  const [data, setData] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    api
      .get('/works')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const editWork = useCallback(
    rowData => {
      history.push(`trabalho/${rowData.id}`);
    },
    [history],
  );

  const handleAddWork = useCallback(() => {
    history.push('trabalho');
  }, [history]);

  const handleClose = useCallback((): void => {
    setOpenDialog(false);
  }, []);

  const deleteWork = useCallback((rowData: any): void => {
    setIdToBeDeleted(rowData.id);
    setOpenDialog(true);
  }, []);

  const handleDeleteWork = useCallback(async () => {
    setOpenDialog(false);
    setLoading(true);
    const res = await api.delete(`/works/${idToBeDeleted}`);

    if (res.status === 204) {
      const worksUpdated = data.filter(work => work.id !== idToBeDeleted);

      setData(worksUpdated);
      setLoading(false);
      setIdToBeDeleted('');
      addToast({
        type: 'success',
        title: 'Trabalho excluído com sucesso',
      });
    } else {
      setLoading(false);
      addToast({
        type: 'error',
        title: 'Falha ao excluir trabalho, tente novamente.',
      });
    }
  }, [idToBeDeleted, addToast, data]);

  return (
    <BasePage title="Trabalhos">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <ArroundButton>
              <Button type="button" onClick={handleAddWork}>
                Adicionar Trabalho
                <AddCircle style={{ color: '#0f5e9e' }} />
              </Button>
            </ArroundButton>
            <MaterialTable
              title="Listagem de Trabalhos"
              localization={labels.materialTable.localization}
              columns={[
                { title: 'Descriçao', field: 'description' },
                { title: 'Grau', field: 'degree.description' },
              ]}
              data={[...data]}
              options={{ pageSize: 10 }}
              style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
              actions={[
                rowData => ({
                  icon: () => <Edit style={{ color: '#1976d2' }} />,
                  onClick: () => editWork(rowData),
                  tooltip: 'Editar',
                }),
                rowData => ({
                  icon: () => <Delete style={{ color: '#c53030' }} />,
                  onClick: () => deleteWork(rowData),
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
                Deseja realmente excluir o trabalho?
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
              <ButtonMT onClick={handleClose} className="buttonCancel">
                Cancelar
              </ButtonMT>
              <ButtonMT
                className="buttonConfirm"
                onClick={handleDeleteWork}
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

export default Works;

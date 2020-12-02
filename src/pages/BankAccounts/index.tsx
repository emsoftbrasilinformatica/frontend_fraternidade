import React, { useState, useEffect, useCallback } from 'react';
import MaterialTable from 'material-table';
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
import { Edit, AddCircle, Delete } from '@material-ui/icons';
import { FaExclamationTriangle } from 'react-icons/fa';

import { useHistory } from 'react-router-dom';
import BasePage from '../../components/BasePage';
import labels from '../../utils/labels';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import Loading from '../../components/Loading';

import { Button, ArroundButton } from './styles';

interface BankAccount {
  id: string;
  description: string;
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

const BankAccounts: React.FC = () => {
  const [data, setData] = useState<BankAccount[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const history = useHistory();
  const classes = useStyles();

  const deleteBankAccount = useCallback((rowData: any): void => {
    setIdToBeDeleted(rowData.id);
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback((): void => {
    setOpenDialog(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/bank-accounts')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const editBankAccount = useCallback(
    rowData => {
      history.push(`conta-bancaria/${rowData.id}`);
    },
    [history],
  );

  const handleAddBankAccount = useCallback(() => {
    history.push('conta-bancaria');
  }, [history]);

  const handleDeleteBankAccount = useCallback(async () => {
    setOpenDialog(false);
    setLoading(true);
    const res = await api.delete(`/bank-accounts/${idToBeDeleted}`);

    if (res.status === 204) {
      const bankAccountsUpdated = data.filter(
        bankAccount => bankAccount.id !== idToBeDeleted,
      );

      setData(bankAccountsUpdated);
      setLoading(false);
      setIdToBeDeleted('');
      addToast({
        type: 'success',
        title: 'Conta Bancária excluída com sucesso',
      });
    } else {
      setLoading(false);
      addToast({
        type: 'error',
        title: 'Falha ao excluir Conta Bancária, tente novamente.',
      });
    }
  }, [idToBeDeleted, addToast, data]);

  return (
    <BasePage title="Contas Bancárias">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <ArroundButton>
              <Button type="button" onClick={handleAddBankAccount}>
                Adicionar Conta Bancária
                <AddCircle style={{ color: '#0f5e9e' }} />
              </Button>
            </ArroundButton>
            <MaterialTable
              title="Listagem de Contas Bancárias"
              localization={labels.materialTable.localization}
              columns={[{ title: 'Conta Bancária', field: 'description' }]}
              data={[...data]}
              style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
              actions={[
                rowData => ({
                  icon: () => <Edit style={{ color: '#1976d2' }} />,
                  onClick: () => editBankAccount(rowData),
                  tooltip: 'Editar',
                }),
                rowData => ({
                  icon: () => <Delete style={{ color: '#c53030' }} />,
                  onClick: () => deleteBankAccount(rowData),
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
                Deseja realmente excluir a conta bancária?
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
              <ButtonMT onClick={handleClose} className="buttonCancel">
                Cancelar
              </ButtonMT>
              <ButtonMT
                className="buttonConfirm"
                onClick={handleDeleteBankAccount}
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

export default BankAccounts;

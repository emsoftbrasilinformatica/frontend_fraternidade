import React, { useState, useEffect, useCallback, useRef } from 'react';
import MaterialTable from 'material-table';
import {
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button as ButtonMT,
  Divider,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { Edit, AddCircle } from '@material-ui/icons';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import BasePage from '../../components/BasePage';

import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';

import { Button, ArroundButton } from './styles';
import Input from '../../components/Input';

interface SessionType {
  id?: string;
  description?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalTitle: {
      background: '#631925',
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
      background: '#631925',
    },
    nested: {
      paddingLeft: theme.spacing(4),
      borderBottom: '1px solid #e0e0e0',
    },
  }),
);

const SessionTypes: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [data, setData] = useState<SessionType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { addToast } = useToast();
  const [editSessionType, setEditSessionType] = useState<SessionType>({});

  const loadSessionTypes = useCallback(() => {
    setLoading(true);
    api
      .get('/session-types')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadSessionTypes();
  }, [loadSessionTypes]);

  const handleClickOpen = useCallback((): void => {
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback((): void => {
    setOpenDialog(false);
    setEditSessionType({});
  }, []);

  const editManagement = useCallback(rowData => {
    setEditSessionType({ id: rowData.id, description: rowData.description });
    setOpenDialog(true);
  }, []);

  const handleSubmit = useCallback(
    async formData => {
      try {
        const schema = Yup.object().shape({
          description: Yup.string().required('Tipo de Sessão é obrigatório'),
        });

        await schema.validate(formData, {
          abortEarly: false,
        });

        setLoading(true);

        if (editSessionType.id === undefined) {
          await api.post('/session-types', formData);
        } else {
          await api.put(`/session-types/${editSessionType.id}`, formData);
        }

        setEditSessionType({});
        setOpenDialog(false);
        setLoading(false);
        loadSessionTypes();

        addToast({
          type: 'success',
          title: 'Novo tipo de sessão cadastrado com sucesso!',
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
    [addToast, loadSessionTypes, editSessionType.id],
  );

  return (
    <BasePage title="Gestões">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <ArroundButton>
              <Button type="button" onClick={handleClickOpen}>
                Adicionar Tipo de Sessão
                <AddCircle style={{ color: '#631925' }} />
              </Button>
            </ArroundButton>
            <MaterialTable
              title="Listagem de Tipos de Sessão"
              localization={labels.materialTable.localization}
              columns={[{ title: 'Tipo de Sessão', field: 'description' }]}
              data={[...data]}
              style={{ marginTop: 16, border: '2px solid #631925' }}
              actions={[
                rowData => ({
                  icon: () => <Edit style={{ color: '#1976d2' }} />,
                  onClick: () => editManagement(rowData),
                  tooltip: 'Editar',
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
            <Form
              ref={formRef}
              initialData={editSessionType}
              onSubmit={handleSubmit}
            >
              <DialogTitle
                className={classes.modalTitle}
                id="alert-dialog-title"
              >
                {/* <BiBookmarkPlus className={classes.iconDialog} /> */}
                Novo Tipo de Sessão
              </DialogTitle>
              <Divider />
              <DialogContent style={{ padding: 56 }}>
                <Input
                  name="description"
                  placeholder="Digite o tipo da sessão"
                  label="Tipo de Sessão"
                />
              </DialogContent>
              <Divider />
              <DialogActions>
                <ButtonMT onClick={handleClose} className="buttonCancel">
                  Cancelar
                </ButtonMT>
                <ButtonMT className="buttonConfirm" type="submit">
                  Cadastrar
                </ButtonMT>
              </DialogActions>
            </Form>
          </Dialog>
        </>
      )}
    </BasePage>
  );
};

export default SessionTypes;

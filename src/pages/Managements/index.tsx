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
import { BiBookmarkPlus } from 'react-icons/bi';
import { FaRegCalendarCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { Edit, AddCircle, PowerSettingsNew } from '@material-ui/icons';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useHistory } from 'react-router-dom';
import BasePage from '../../components/BasePage';
import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';

import { Button, ArroundButton } from './styles';
import Input from '../../components/Input';

// interface TableState {
//   columns: Array<Column<Row>>;
//   data: Row[];
// }

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

interface Management {
  id: string;
  active: boolean;
  start_year: number;
  last_year: number;
}

const Managements: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [data, setData] = useState<Management[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const { addToast } = useToast();

  const loadManagements = useCallback(() => {
    setLoading(true);
    api
      .get('/managements')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadManagements();
  }, [loadManagements]);

  const handleClickOpen = useCallback((): void => {
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback((): void => {
    setOpenDialog(false);
  }, []);

  const editManagement = useCallback(
    rowData => {
      history.push(`gestao/${rowData.id}`);
    },
    [history],
  );

  const handleChangeStatus = useCallback(
    async rowData => {
      setLoading(true);
      await api.patch<Management>(`/managements/activate/${rowData.id}`);
      setLoading(false);
      loadManagements();
      addToast({
        type: 'success',
        title: 'Gestão ativada com sucesso!',
      });
    },
    [loadManagements, addToast],
  );

  const handleSubmit = useCallback(
    async formData => {
      try {
        const schema = Yup.object().shape({
          start_year: Yup.number()
            .transform((v, o) => (o === '' ? null : v))
            .nullable()
            .required('Ano Inicial é obrigatório'),
          last_year: Yup.number()
            .transform((v, o) => (o === '' ? null : v))
            .nullable()
            .required('Ano Final é obrigatório'),
        });

        await schema.validate(formData, {
          abortEarly: false,
        });

        setLoading(true);

        await api.post('/managements', formData);

        setOpenDialog(false);
        setLoading(false);
        loadManagements();

        addToast({
          type: 'success',
          title: 'Nova gestão cadastrada com sucesso!',
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
    [addToast, loadManagements],
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
                Adicionar Gestão
                <AddCircle style={{ color: '#0f5e9e' }} />
              </Button>
            </ArroundButton>
            <MaterialTable
              title="Listagem de Gestões"
              localization={labels.materialTable.localization}
              columns={[
                {
                  title: 'Ativa',
                  field: 'active',
                  type: 'boolean',
                  align: 'center',
                  width: '10%',
                },
                { title: 'Ano Inicial', field: 'start_year' },
                { title: 'Ano Final', field: 'last_year' },
              ]}
              data={[...data]}
              style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
              actions={[
                rowData => ({
                  icon: () => <Edit style={{ color: '#1976d2' }} />,
                  onClick: () => editManagement(rowData),
                  tooltip: 'Editar',
                }),
                rowData => ({
                  icon: () => (
                    <PowerSettingsNew
                      style={{ color: rowData.active ? '#28a745' : '#c53030' }}
                    />
                  ),
                  onClick: () => handleChangeStatus(rowData),
                  tooltip: rowData.active ? 'Inativar' : 'Ativar',
                  hidden: rowData.active,
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
            <Form ref={formRef} onSubmit={handleSubmit}>
              <DialogTitle
                className={classes.modalTitle}
                id="alert-dialog-title"
              >
                <BiBookmarkPlus className={classes.iconDialog} />
                Nova Gestão
              </DialogTitle>
              <Divider />
              <DialogContent style={{ padding: 56 }}>
                <Input
                  name="start_year"
                  placeholder="Digite o Ano Inicial"
                  label="Ano Inicial"
                  type="number"
                  icon={FaRegCalendarCheck}
                />
                <Input
                  name="last_year"
                  placeholder="Digite o Ano Final"
                  label="Ano Final"
                  type="number"
                  icon={FaRegCalendarTimes}
                />
              </DialogContent>
              <Divider />
              <DialogActions>
                <ButtonMT onClick={handleClose} className="buttonCancel">
                  Cancelar
                </ButtonMT>
                <ButtonMT className="buttonConfirm" type="submit">
                  Criar Gestão
                </ButtonMT>
              </DialogActions>
            </Form>
          </Dialog>
        </>
      )}
    </BasePage>
  );
};

export default Managements;

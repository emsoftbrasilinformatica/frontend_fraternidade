import React, { useCallback, useMemo, useState } from 'react';
import { format, isBefore } from 'date-fns';
import { FiCheckCircle, FiEdit, FiTrash as FiDelete } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Tooltip from '@material-ui/core/Tooltip';

import { FaCalendarDay, FaClock } from 'react-icons/fa';
import {
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { Container } from './styles';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface Props {
  id: string;
  degree: string;
  number: string;
  session_type: string;
  date: Date;
  deleteCallback: Function;
}

const SessionItem: React.FC<Props> = ({
  date,
  degree,
  number,
  session_type,
  id,
  deleteCallback,
}) => {
  const { addToast } = useToast();
  const [stateDialog, setStateDialog] = useState<boolean>(false);

  const hourFormatted = useMemo(() => {
    return format(new Date(date), 'HH:mm');
  }, [date]);

  const dateFormatted = useMemo(() => {
    return format(new Date(date), 'dd/MM/yyyy');
  }, [date]);

  const canAddPresence = useMemo(() => {
    return isBefore(new Date(date), new Date());
  }, [date]);

  const handleDeleteSession = useCallback(async (): Promise<void> => {
    setStateDialog(true);
  }, []);

  const deleteSession = useCallback(async () => {
    await api
      .delete(`/sessions/${id}`)
      .then(resp => {
        addToast({
          type: 'success',
          title: 'Sessão excluída com sucesso',
        });
        deleteCallback();
      })
      .catch(err => {
        addToast({
          type: 'error',
          title: 'Não é possível excluir sessões que possuem presença',
        });
      });
  }, [addToast, deleteCallback, id]);

  return (
    <Container>
      <div className="titleSession">
        Número: {number} | Grau: {degree}
      </div>
      <div className="titleSession">Tipo de Sessão: {session_type}</div>
      <div className="titleSession">
        <FaCalendarDay style={{ marginRight: 4 }} />
        <span>{dateFormatted}</span>
        <FaClock style={{ margin: '0 4px 0 25px' }} />
        <span>{hourFormatted}</span>
      </div>
      <div className="contentIcon">
        <Tooltip
          title="Excluir"
          placement="top"
          style={{ marginRight: 16 }}
          arrow
        >
          <Link to="/app/cad/sessoes" onClick={handleDeleteSession}>
            <FiDelete size={40} />
          </Link>
        </Tooltip>
        <Tooltip title="Editar" placement="top" arrow>
          <Link to={`/app/cad/sessao/${id}`}>
            <FiEdit size={40} />
          </Link>
        </Tooltip>
        {canAddPresence && (
          <Tooltip
            style={{ marginLeft: 16 }}
            title="Presenças"
            placement="top"
            arrow
          >
            <Link to={`/app/cad/presencas-sessao/${id}`}>
              <FiCheckCircle size={40} />
            </Link>
          </Tooltip>
        )}
      </div>
      <Dialog
        open={stateDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Excluir sessão</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Tem certeza que deseja excluir a sessão número ${number}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setStateDialog(false);
              deleteSession();
            }}
            color="primary"
            variant="contained"
            style={{ backgroundColor: colors.red[500] }}
          >
            Excluir
          </Button>
          <Button
            onClick={() => {
              setStateDialog(false);
            }}
            color="primary"
            variant="contained"
            autoFocus
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SessionItem;

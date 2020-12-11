import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import Tooltip from '@material-ui/core/Tooltip';
import { Visibility } from '@material-ui/icons';

import { FaCalendarDay, FaClock } from 'react-icons/fa';
import { Container } from './styles';

interface Props {
  id: string;
  degree: string;
  number: string;
  session_type: string;
  date: Date;
}

const SessionItem: React.FC<Props> = ({
  date,
  degree,
  number,
  session_type,
  id,
}) => {
  const hourFormatted = useMemo(() => {
    return format(new Date(date), 'HH:mm');
  }, [date]);

  const dateFormatted = useMemo(() => {
    return format(new Date(date), 'dd/MM/yyyy');
  }, [date]);

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
        <Tooltip title="Visualizar " placement="top" arrow>
          <Link to={`/app/geral/agenda-sessoes/sessao/${id}`}>
            <Visibility style={{ fontSize: 40 }} />
          </Link>
        </Tooltip>
      </div>
    </Container>
  );
};

export default SessionItem;

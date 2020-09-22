import React, { useState, useCallback, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Container, Grid } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import { Calendar, ArroundButton } from './styles';

import BasePage from '../../components/BasePage';
import SessionItem from '../../components/SessionItem';
import api from '../../services/api';

interface Session {
  id: string;
  date: Date;
  number: string;
  session_type: {
    description: string;
  };
  degree: {
    description: string;
  };
}

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const history = useHistory();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  useEffect(() => {
    api
      .get('/sessions/day', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(res => {
        setSessions(res.data);
      });
  }, [selectedDate]);

  const handleAddSession = useCallback(() => {
    history.push('sessao');
  }, [history]);

  return (
    <>
      <BasePage title="Sessões" backLink="/app/sessoes">
        <Container style={{ marginTop: 32 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ArroundButton>
                <button type="button" onClick={handleAddSession}>
                  Adicionar Sessão
                  <AddCircle style={{ color: '#631925' }} />
                </button>
              </ArroundButton>
              <Calendar>
                <DayPicker
                  weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                  modifiers={{
                    available: { daysOfWeek: [1, 2, 3, 4, 5] },
                  }}
                  onDayClick={handleDateChange}
                  selectedDays={selectedDate}
                  months={[
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',
                  ]}
                />
              </Calendar>
            </Grid>
            <Grid item xs={12} md={6}>
              {sessions.map(session => (
                <SessionItem
                  key={session.id}
                  date={session.date}
                  degree={session.degree.description}
                  session_type={session.session_type.description}
                  number={session.number}
                  id={session.id}
                />
              ))}
            </Grid>
          </Grid>
        </Container>
      </BasePage>
    </>
  );
};

export default Sessions;

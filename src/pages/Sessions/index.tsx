import React, { useState, useCallback, useEffect, useMemo } from 'react';

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
    degree: {
      description: string;
    };
    type: string;
  };
}

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [monthSessions, setMonthSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);
  const history = useHistory();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const sessionsDay = useCallback(() => {
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

  useEffect(() => {
    sessionsDay();
  }, [selectedDate, sessionsDay]);

  const sessionsMonth = useCallback(() => {
    api
      .get('/sessions/month', {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(res => {
        setMonthSessions(res.data);
      });
  }, [currentMonth]);

  useEffect(() => {
    sessionsMonth();
  }, [currentMonth, sessionsMonth]);

  const sessionsInMonth: Date[] = useMemo(() => {
    return monthSessions.map(session => {
      return new Date(session.date);
    });
  }, [monthSessions]);

  const handleAddSession = useCallback(() => {
    history.push('/app/cad/sessao');
  }, [history]);

  return (
    <>
      <BasePage title="Sessões">
        <Container style={{ marginTop: 32 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ArroundButton>
                <button type="button" onClick={handleAddSession}>
                  Adicionar Sessão
                  <AddCircle style={{ color: '#0f5e9e' }} />
                </button>
              </ArroundButton>
              <Calendar>
                <DayPicker
                  weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                  modifiers={{
                    available: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
                    haveSession: sessionsInMonth,
                  }}
                  onDayClick={handleDateChange}
                  onMonthChange={handleMonthChange}
                  selectedDays={selectedDate}
                  showOutsideDays
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
                  degree={session.session_type.degree.description}
                  session_type={`${session.session_type.type.substring(
                    0,
                    1,
                  )} - ${session.session_type.description}`}
                  number={session.number}
                  id={session.id}
                  deleteCallback={() => {
                    sessionsDay();
                    sessionsMonth();
                  }}
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

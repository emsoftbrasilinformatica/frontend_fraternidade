import React, { useState, useCallback, useEffect, useMemo } from 'react';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Container, Grid } from '@material-ui/core';
import { Calendar } from './styles';

import { useAuth } from '../../hooks/auth';
import BasePage from '../../components/BasePage';
import SessionScheduleItemItem from '../../components/SessionScheduleItem';
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

const SessionSchedule: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [monthSessions, setMonthSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user } = useAuth();

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  useEffect(() => {
    api
      .get('/sessions/day/degree', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
          order: user.degree.order,
        },
      })
      .then(res => {
        setSessions(res.data);
      });
  }, [selectedDate, user]);

  useEffect(() => {
    api
      .get('/sessions/month/degree', {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
          order: user.degree.order,
        },
      })
      .then(res => {
        setMonthSessions(res.data);
      });
  }, [currentMonth, user]);

  const sessionsInMonth: Date[] = useMemo(() => {
    return monthSessions.map(session => {
      return new Date(session.date);
    });
  }, [monthSessions]);

  return (
    <>
      <BasePage title="Agenda de Sessões">
        <Container style={{ marginTop: 32 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
                <SessionScheduleItemItem
                  key={session.id}
                  date={session.date}
                  degree={session.session_type.degree.description}
                  session_type={`${session.session_type.type.substring(
                    0,
                    1,
                  )} - ${session.session_type.description}`}
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

export default SessionSchedule;

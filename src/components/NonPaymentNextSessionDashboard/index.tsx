import React, { useState, useEffect, useMemo } from 'react';

import { Grid } from '@material-ui/core';
import { format } from 'date-fns';
import { FaCalendarDay, FaClock } from 'react-icons/fa';

import { Container, SessionItem } from './styles';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';

interface FinancialPosting {
  id?: string;
  obreiro?: {
    id: string;
    name: string;
  };
  costCenter: {
    id: string;
    description: string;
  };
  teller: {
    id: string;
    description: string;
  };
  typeFinancialPosting: {
    id: string;
    description: string;
  };
  date: string;
  mov: string;
  value: number;
  value_formatted?: string;
  due_date?: string;
  payday?: string;
}

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

const NonPaymentNextSessionDashboard: React.FC = () => {
  const [monthlyPayments, setMonthlyPayments] = useState<FinancialPosting[]>(
    [],
  );
  const [payments, setPayments] = useState<FinancialPosting[]>([]);
  const [session, setSession] = useState<Session>();
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      api.get<FinancialPosting[]>('/non-monthly-payments/by-id', {
        params: {
          date: format(new Date(), 'yyyy-MM-dd'),
          user_id: user.id,
        },
      }),
      api.get<FinancialPosting[]>('/non-payments/by-id', {
        params: {
          date: format(new Date(), 'yyyy-MM-dd'),
          user_id: user.id,
        },
      }),
      api.get<Session>('/sessions/next-session', {
        params: {
          date: format(new Date(), 'yyyy-MM-dd'),
        },
      }),
    ]).then(values => {
      setMonthlyPayments(
        values[0].data.map(result => {
          return {
            value_formatted: formatValue(result.value),
            ...result,
          };
        }),
      );

      setPayments(
        values[1].data.map(result => {
          return {
            value_formatted: formatValue(result.value),
            ...result,
          };
        }),
      );

      setSession(values[2].data);
    });
  }, [user]);

  const totalNonMonthlyPayment = useMemo(() => {
    return monthlyPayments.reduce((acc, financialPosting) => {
      return acc + financialPosting.value;
    }, 0);
  }, [monthlyPayments]);

  const totalNonPayment = useMemo(() => {
    return payments.reduce((acc, financialPosting) => {
      return acc + financialPosting.value;
    }, 0);
  }, [payments]);

  const hourFormatted = useMemo(() => {
    if (session) {
      return format(new Date(session.date), 'HH:mm');
    }
    return null;
  }, [session]);

  const dateFormatted = useMemo(() => {
    if (session) {
      return format(new Date(session.date), 'dd/MM/yyyy');
    }
    return null;
  }, [session]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Container totalNonPayments={totalNonMonthlyPayment}>
          <div className="title">Mensalidades em aberto</div>
          <div className="value">{formatValue(totalNonMonthlyPayment)}</div>
        </Container>
      </Grid>

      <Grid item xs={12} md={4}>
        <Container totalNonPayments={totalNonPayment}>
          <div className="title">Outros em aberto</div>
          <div className="value">{formatValue(totalNonPayment)}</div>
        </Container>
      </Grid>

      <Grid item xs={12} md={4}>
        <SessionItem>
          <div className="titleCard">Proxima Sessão</div>
          {session ? (
            <>
              <div className="titleSession">
                Número: {session?.number} | Grau:{' '}
                {session?.session_type.degree.description}
              </div>
              <div className="titleSession">
                Tipo de Sessão: {session?.session_type.description}
              </div>
              <div className="titleSession">
                <FaCalendarDay style={{ marginRight: 4 }} />
                <span>{dateFormatted}</span>
                <FaClock style={{ margin: '0 4px 0 25px' }} />
                <span>{hourFormatted}</span>
              </div>
            </>
          ) : (
            <div className="titleSession">Sem próxima sessão</div>
          )}
        </SessionItem>
      </Grid>
    </Grid>
  );
};

export default NonPaymentNextSessionDashboard;

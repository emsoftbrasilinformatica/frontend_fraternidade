import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { useParams, useHistory } from 'react-router-dom';
import Button from '../../../components/Button';
import { useToast } from '../../../hooks/toast';
import BasePage from '../../../components/BasePage';
import Card from '../../../components/Card';
import api from '../../../services/api';
import labels from '../../../utils/labels';
import Loading from '../../../components/Loading';

interface User {
  id: string;
  name: string;
  cim: number;
  degree: {
    description: string;
    order: number;
  };
  tableData: {
    id?: string;
    checked: boolean;
  };
}

interface Session {
  id: string;
  date: Date;
  number: string;
  session_type: {
    description: string;
  };
  degree: {
    description: string;
    order: number;
  };
}

interface Presence {
  user_id: string;
  presence: boolean;
  session_id?: string;
}

interface params {
  id: string;
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#631925',
    },
    secondary: {
      main: '#631925',
    },
  },
});

const Presences: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [session, setSession] = useState<Session>();
  const [sessionPresences, setSessionPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(false);
  const params: params = useParams();
  const { addToast } = useToast();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<User[]>('/users'),
      api.get(`/session-presences/${params.id}`),
      api.get(`/sessions/show/${params.id}`),
    ])
      .then(values => {
        setUsers(
          values[0].data.map(user => {
            return {
              ...user,
              tableData: { checked: false },
            };
          }),
        );
        setSessionPresences(values[1].data);
        setSession(values[2].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  const usersCanBePresence = useMemo(() => {
    const usersPass = users.filter(user => {
      if (session?.session_type.description.includes('M - ')) {
        if (
          user.degree.order === session.degree.order ||
          user.degree.order === session.degree.order - 1
        ) {
          return user;
        }
      } else if (session?.session_type.description.includes('O - ')) {
        if (user.degree.order === session?.degree.order) {
          return user;
        }
      } else {
        return user;
      }
      return undefined;
    });

    usersPass.map(user => {
      sessionPresences.forEach(presence => {
        if (presence.user_id === user.id) {
          user.tableData.checked = presence.presence;
        }
      });
      return user;
    });
    return usersPass;
  }, [users, session, sessionPresences]);

  const handleSavePresences = useCallback(async () => {
    try {
      setLoading(true);
      const presences: Presence[] = usersCanBePresence.map(user => {
        return {
          presence: user.tableData.checked,
          user_id: user.id,
          session_id: session?.id,
        };
      });

      await api.post('/session-presences', { presences });

      setLoading(false);

      history.push('/app/cad/sessoes');
      addToast({
        type: 'success',
        title: 'Presenças salvas com sucesso!',
        description: '',
      });
    } catch (err) {
      setLoading(false);
      addToast({
        type: 'error',
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao salvar as presenças, tente novamente.',
      });
    }
  }, [usersCanBePresence, session, addToast, history]);

  return (
    <BasePage title="Presenças" backLink="/app/cad/sessoes">
      <ThemeProvider theme={theme}>
        {loading ? (
          <Loading />
        ) : (
          <Container>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleSavePresences} type="button">
                SALVAR
              </Button>
            </div>
            <Card
              title={`Número: ${session?.number} | Tipo: ${session?.session_type.description} | ${session?.degree.description}`}
            >
              <MaterialTable
                title="Lista de presença"
                columns={[
                  {
                    title: 'Usuário',
                    field: 'name',
                  },
                  {
                    title: 'CIM',
                    field: 'cim',
                  },
                ]}
                style={{
                  marginTop: 16,
                  border: '2px solid #631925',
                }}
                data={usersCanBePresence}
                localization={labels.materialTable.localization}
                options={{
                  selection: true,
                  pageSize: 20,
                }}
              />
            </Card>
          </Container>
        )}
      </ThemeProvider>
    </BasePage>
  );
};

export default Presences;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CircularProgress, Container } from '@material-ui/core';
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
  active: boolean;
  degree: {
    description: string;
    order: number;
  };
  tableData: {
    id?: string;
    checked: boolean;
  };
}

interface UserRequest {
  id: string;
  degree: {
    description: string;
    order: number;
  };
  presence: boolean;
}

interface Session {
  id: string;
  date: Date;
  number: string;
  session_type: {
    description: string;
    type: string;
    degree: {
      description: string;
      order: number;
    };
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

const Presences: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [session, setSession] = useState<Session>();
  const [sessionPresences, setSessionPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
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
      if (user.active) {
        if (session?.session_type.type === 'Magna') {
          if (
            user.degree.order >= session.session_type.degree.order ||
            user.degree.order === session.session_type.degree.order - 1
          ) {
            return user;
          }
        } else if (session?.session_type.type === 'Ordinária') {
          if (user.degree.order >= session?.session_type.degree.order) {
            return user;
          }
        } else {
          return user;
        }
        return undefined;
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
      setSaveLoading(true);
      const usersRequest: UserRequest[] = usersCanBePresence.map(user => {
        return {
          id: user.id,
          degree: user.degree,
          presence: user.tableData.checked,
        };
      });

      await api.post('/session-presences', { session, users: usersRequest });

      setSaveLoading(false);

      history.push('/app/cad/sessoes');
      addToast({
        type: 'success',
        title: 'Presenças salvas com sucesso!',
        description: '',
      });
    } catch (err) {
      setSaveLoading(false);
      addToast({
        type: 'error',
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao salvar as presenças, tente novamente.',
      });
    }
  }, [usersCanBePresence, session, addToast, history]);

  return (
    <BasePage title="Presenças" backLink="/app/cad/sessoes">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              disabled={!!saveLoading}
              onClick={handleSavePresences}
            >
              {saveLoading ? (
                <CircularProgress style={{ color: '#FFF' }} />
              ) : (
                'SALVAR'
              )}
            </Button>
          </div>
          <Card
            title={`Número: ${
              session?.number
            } | Tipo: ${session?.session_type.type.substring(0, 1)} - ${
              session?.session_type.description
            } | ${session?.session_type.degree.description}`}
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
                {
                  title: 'Grau',
                  field: 'degree.description',
                },
              ]}
              style={{
                marginTop: 16,
                border: '2px solid #0f5e9e',
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
    </BasePage>
  );
};

export default Presences;

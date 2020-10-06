import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { useParams, useHistory } from 'react-router-dom';
import Button from '../../../components/Button';
import BasePage from '../../../components/BasePage';
import Card from '../../../components/Card';
import api from '../../../services/api';
import labels from '../../../utils/labels';

interface User {
  id: string;
  name: string;
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
  const [sessionPresences, setSessionPresences] = useState([]);
  const params: params = useParams();

  useEffect(() => {
    Promise.all([
      api.get<User[]>('/users'),
      api.get(`/session-presences/${params.id}`),
      api.get(`/sessions/show/${params.id}`),
    ]).then(values => {
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
    });
  }, [params.id]);

  const usersCanBePresence = useMemo(() => {
    return users.filter(user => {
      if (session?.session_type.description.includes('Iniciação')) {
        if (
          user.degree.order === session.degree.order ||
          user.degree.order === session.degree.order - 1
        ) {
          return user;
        }
      } else if (user.degree.order === session?.degree.order) {
        return user;
      }
    });
  }, [users, session]);

  const handleSavePresences = useCallback(() => {
    console.log(users);
  }, [users]);

  return (
    <BasePage title="Presenças" backLink="/app/sessoes">
      <ThemeProvider theme={theme}>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleSavePresences} type="button">
              SALVAR
            </Button>
          </div>
          <Card title="Presentes Sessão 25 - Mestre">
            <MaterialTable
              title="Lista de presença"
              columns={[
                {
                  title: 'Usuário',
                  field: 'name',
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
                pageSize: 22,
              }}
            />
          </Card>
        </Container>
      </ThemeProvider>
    </BasePage>
  );
};

export default Presences;

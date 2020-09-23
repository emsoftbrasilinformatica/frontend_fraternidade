import React, { useCallback, useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Button from '../../../components/Button';
import BasePage from '../../../components/BasePage';
import Card from '../../../components/Card';
import api from '../../../services/api';
import labels from '../../../utils/labels';

interface User {
  id: string;
  name: string;
  tableData: {
    id?: string;
    checked: boolean;
  };
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

  useEffect(() => {
    api.get<User[]>('/users').then(res => {
      setUsers(
        res.data.map(user => {
          return {
            ...user,
            tableData: { checked: true },
          };
        }),
      );
    });
  }, []);

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
              data={users}
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

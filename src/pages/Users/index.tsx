import React, { useState, useEffect, useCallback } from 'react';
import MaterialTable from 'material-table';
import { Container } from '@material-ui/core';
import { Edit, AddCircle, PowerSettingsNew } from '@material-ui/icons';

import { useHistory } from 'react-router-dom';
import BasePage from '../../components/BasePage';
import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';

import { Button, ArroundButton } from './styles';

// interface TableState {
//   columns: Array<Column<Row>>;
//   data: Row[];
// }

interface User {
  id: string;
  active: boolean;
  name: string;
  cim: number;
  cpf: string;
  date_of_birth: string;
}

const Users: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    api
      .get('/users')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const editUser = useCallback(
    rowData => {
      history.push(`usuario/${rowData.id}`);
    },
    [history],
  );

  const handleChangeStatus = useCallback(
    async rowData => {
      setLoading(true);
      const userUpdated = await api.patch<User>(`/users/${rowData.id}/status`);

      const dataUpdated = data.map(user => {
        if (user.id === userUpdated.data.id) {
          user.active = userUpdated.data.active;
        }
        return user;
      });

      setData(dataUpdated);
      setLoading(false);
    },
    [data],
  );

  const handleAddUser = useCallback(() => {
    history.push('usuario');
  }, [history]);

  return (
    <BasePage title="Usuários">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <ArroundButton>
            <Button type="button" onClick={handleAddUser}>
              Adicionar Usuário
              <AddCircle style={{ color: '#0f5e9e' }} />
            </Button>
          </ArroundButton>
          <MaterialTable
            title="Listagem de Usuários"
            localization={labels.materialTable.localization}
            columns={[
              {
                title: 'Ativo',
                field: 'active',
                type: 'boolean',
                align: 'center',
                width: '10%',
              },
              { title: 'Nome', field: 'name', width: '40%' },
              { title: 'CIM', field: 'cim', width: '15%' },
              { title: 'CPF', field: 'cpf', width: '20%' },
              {
                title: 'Data de Nascimento',
                field: 'date_of_birth',
                type: 'date',
                width: '15%',
              },
            ]}
            data={[...data]}
            options={{ pageSize: 10 }}
            style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
            actions={[
              rowData => ({
                icon: () => <Edit style={{ color: '#1976d2' }} />,
                onClick: () => editUser(rowData),
                tooltip: 'Editar',
              }),
              rowData => ({
                icon: () => (
                  <PowerSettingsNew
                    style={{ color: rowData.active ? '#28a745' : '#c53030' }}
                  />
                ),

                onClick: () => handleChangeStatus(rowData),
                tooltip: rowData.active ? 'Inativar' : 'Ativar',
              }),
            ]}
          />
        </Container>
      )}
    </BasePage>
  );
};

export default Users;

import React, { useState, useEffect, useCallback } from 'react';
import MaterialTable from 'material-table';
import { Container } from '@material-ui/core';

import { Edit, AddCircle } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import BasePage from '../../components/BasePage';

import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';

import { Button, ArroundButton } from './styles';

interface SessionType {
  id?: string;
  description: string;
  type: string;
  degree: {
    description?: string;
    order: number;
  };
}

const SessionTypes: React.FC = () => {
  const [data, setData] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const loadSessionTypes = useCallback(() => {
    setLoading(true);
    api
      .get('/session-types')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadSessionTypes();
  }, [loadSessionTypes]);

  const handleAddSessionType = useCallback(() => {
    history.push('tipo-sessao');
  }, [history]);

  const editSessionType = useCallback(
    rowData => {
      history.push(`tipo-sessao/${rowData.id}`);
    },
    [history],
  );

  return (
    <BasePage title="Tipos de Sessão">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <ArroundButton>
            <Button type="button" onClick={handleAddSessionType}>
              Adicionar Tipo de Sessão
              <AddCircle style={{ color: '#0f5e9e' }} />
            </Button>
          </ArroundButton>
          <MaterialTable
            title="Listagem de Tipos de Sessão"
            localization={labels.materialTable.localization}
            columns={[
              { title: 'Descrição', field: 'description' },
              { title: 'Tipo de Sessão', field: 'type' },
              { title: 'Grau', field: 'degree.description' },
            ]}
            data={[...data]}
            style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
            actions={[
              rowData => ({
                icon: () => <Edit style={{ color: '#1976d2' }} />,
                onClick: () => editSessionType(rowData),
              }),
            ]}
          />
        </Container>
      )}
    </BasePage>
  );
};

export default SessionTypes;

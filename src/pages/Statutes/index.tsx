import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@material-ui/core';
import { Edit, AddCircle } from '@material-ui/icons';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router-dom';
import { Button, ArroundButton } from './styles';

import BasePage from '../../components/BasePage';
import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';

interface Statute {
  id: string;
  description: string;
  degree: {
    description: string;
  };
}

const Statutes: React.FC = () => {
  const [data, setData] = useState<Statute[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    api
      .get('/statutes')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const editStatute = useCallback(
    rowData => {
      history.push(`estatuto/${rowData.id}`);
    },
    [history],
  );

  const handleAddStatute = useCallback(() => {
    history.push('estatuto');
  }, [history]);

  return (
    <BasePage title="Estatutos">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <ArroundButton>
            <Button type="button" onClick={handleAddStatute}>
              Adicionar Estatuto
              <AddCircle style={{ color: '#631925' }} />
            </Button>
          </ArroundButton>
          <MaterialTable
            title="Listagem de Estatutos"
            localization={labels.materialTable.localization}
            columns={[
              { title: 'Descriçao', field: 'description' },
              { title: 'Grau', field: 'degree.description' },
            ]}
            data={[...data]}
            options={{ pageSize: 10 }}
            style={{ marginTop: 16, border: '2px solid #631925' }}
            actions={[
              rowData => ({
                icon: () => <Edit style={{ color: '#1976d2' }} />,
                onClick: () => editStatute(rowData),
                tooltip: 'Editar',
              }),
            ]}
          />
        </Container>
      )}
    </BasePage>
  );
};

export default Statutes;

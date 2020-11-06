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

interface CostCenter {
  id: string;
  description: string;
}

const Tellers: React.FC = () => {
  const [data, setData] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    api
      .get('/tellers')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const editTeller = useCallback(
    rowData => {
      history.push(`caixa/${rowData.id}`);
    },
    [history],
  );

  const handleAddTeller = useCallback(() => {
    history.push('caixa');
  }, [history]);

  return (
    <BasePage title="Caixas">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <ArroundButton>
            <Button type="button" onClick={handleAddTeller}>
              Adicionar Caixa
              <AddCircle style={{ color: '#0f5e9e' }} />
            </Button>
          </ArroundButton>
          <MaterialTable
            title="Listagem de Caixas"
            localization={labels.materialTable.localization}
            columns={[
              { title: 'Descrição', field: 'description' },
              { title: 'Centro de Custo', field: 'costCenter.description' },
            ]}
            data={[...data]}
            options={{ pageSize: 10 }}
            style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
            actions={[
              rowData => ({
                icon: () => <Edit style={{ color: '#1976d2' }} />,
                onClick: () => editTeller(rowData),
                tooltip: 'Editar',
              }),
            ]}
          />
        </Container>
      )}
    </BasePage>
  );
};

export default Tellers;

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

const CostCenters: React.FC = () => {
  const [data, setData] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    api
      .get('/cost-centers')
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const editCostCenter = useCallback(
    rowData => {
      history.push(`centro-custo/${rowData.id}`);
    },
    [history],
  );

  const handleAddCostCenter = useCallback(() => {
    history.push('centro-custo');
  }, [history]);

  return (
    <BasePage title="Centros de Custo">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <ArroundButton>
            <Button type="button" onClick={handleAddCostCenter}>
              Adicionar Centro de Custo
              <AddCircle style={{ color: '#0f5e9e' }} />
            </Button>
          </ArroundButton>
          <MaterialTable
            title="Listagem de Centros de Custo"
            localization={labels.materialTable.localization}
            columns={[{ title: 'Descriçao', field: 'description' }]}
            data={[...data]}
            options={{ pageSize: 10 }}
            style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
            actions={[
              rowData => ({
                icon: () => <Edit style={{ color: '#1976d2' }} />,
                onClick: () => editCostCenter(rowData),
                tooltip: 'Editar',
              }),
            ]}
          />
        </Container>
      )}
    </BasePage>
  );
};

export default CostCenters;

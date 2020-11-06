import React, { useCallback, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Container } from '@material-ui/core';

import { Edit, AddCircle } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import BasePage from '../../components/BasePage';

import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';

import formatValue from '../../utils/formatValue';

import { Button, ArroundButton } from './styles';

interface TypeFinancialPosting {
  id?: string;
  description: string;
  type: string;
  default_value: number;
  default_value_formatted?: string;
}

const TypesFinancialPostings: React.FC = () => {
  const [data, setData] = useState<TypeFinancialPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const loadTypesFinancialPostings = useCallback(() => {
    setLoading(true);
    api
      .get<TypeFinancialPosting[]>('/types-financial-postings')
      .then(response => {
        setData(
          response.data.map(result => {
            return {
              default_value_formatted: formatValue(result.default_value),
              ...result,
            };
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadTypesFinancialPostings();
  }, [loadTypesFinancialPostings]);

  const handleAddTypeFinancialPosting = useCallback(() => {
    history.push('tipo-lancamento');
  }, [history]);

  const editTypeFinancialPosting = useCallback(
    rowData => {
      history.push(`tipo-lancamento/${rowData.id}`);
    },
    [history],
  );

  return (
    <BasePage title="Tipos de Lançamentos Finan.">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <ArroundButton>
            <Button type="button" onClick={handleAddTypeFinancialPosting}>
              Adicionar Tipo de Lançamento Finan.
              <AddCircle style={{ color: '#0f5e9e' }} />
            </Button>
          </ArroundButton>
          <MaterialTable
            title="Listagem de Tipos de Lançamentos Finan."
            localization={labels.materialTable.localization}
            columns={[
              { title: 'Descrição', field: 'description' },
              { title: 'Créd./Déb', field: 'type' },
              { title: 'Valor Padrão', field: 'default_value_formatted' },
            ]}
            data={[...data]}
            style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
            actions={[
              rowData => ({
                icon: () => <Edit style={{ color: '#1976d2' }} />,
                onClick: () => editTypeFinancialPosting(rowData),
              }),
            ]}
          />
        </Container>
      )}
    </BasePage>
  );
};

export default TypesFinancialPostings;

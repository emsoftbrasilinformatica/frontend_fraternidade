import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@material-ui/core';
import { FaDownload } from 'react-icons/fa';
import MaterialTable from 'material-table';
import { useAuth } from '../../hooks/auth';

import BasePage from '../../components/BasePage';
import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';

interface Work {
  id: string;
  description: string;
  degree: {
    description: string;
  };
}

const GeneralLibrary: React.FC = () => {
  const [data, setData] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/works/degree/${user.degree.order}`)
      .then(response => {
        setData(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const generateDownload = useCallback((rowData: any): void => {
    const element = document.createElement('a');
    element.href = rowData.file_url;
    element.download = rowData.file;
    element.target = '_blank';
    element.click();
  }, []);

  return (
    <BasePage title="Biblioteca">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <MaterialTable
              title="Listagem"
              localization={labels.materialTable.localization}
              columns={[
                { title: 'Descriçao', field: 'description' },
                { title: 'Grau', field: 'degree.description' },
              ]}
              data={[...data]}
              options={{ pageSize: 10 }}
              style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
              actions={[
                rowData => ({
                  icon: () => <FaDownload style={{ color: '#25b922' }} />,
                  onClick: () => generateDownload(rowData),
                  tooltip: 'Download',
                }),
              ]}
            />
          </Container>
        </>
      )}
    </BasePage>
  );
};

export default GeneralLibrary;

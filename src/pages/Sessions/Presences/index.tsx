import React from 'react';
import { Container } from '@material-ui/core';
import BasePage from '../../../components/BasePage';

const Presences: React.FC = () => {
  return (
    <BasePage title="Presenças" backLink="/app/sessoes">
      <Container>
        <div>Teste</div>
      </Container>
    </BasePage>
  );
};

export default Presences;

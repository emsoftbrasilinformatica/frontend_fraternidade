import React from 'react';

import { Container } from '@material-ui/core';
import 'react-day-picker/lib/style.css';

import BasePage from '../../components/BasePage';
import Birthdays from '../../components/Birthdays';
import NonPaymentNextSessionDashboard from '../../components/NonPaymentNextSessionDashboard';

const Dashboard: React.FC = () => {
  return (
    <BasePage title="Dashboard">
      <Container style={{ marginTop: 32 }}>
        <Birthdays />
        <NonPaymentNextSessionDashboard />
      </Container>
    </BasePage>
  );
};

export default Dashboard;

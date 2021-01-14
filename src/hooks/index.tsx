import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { ForceUpdateProvider } from './forceUpdate';
import { FinancialPostingsFiltersProvider } from './financialPostingsFilters';
import { DonationsFiltersProvider } from './donationsFilters';

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ForceUpdateProvider>
          <FinancialPostingsFiltersProvider>
            <DonationsFiltersProvider>{children}</DonationsFiltersProvider>
          </FinancialPostingsFiltersProvider>
        </ForceUpdateProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AppProvider;

import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { ForceUpdateProvider } from './forceUpdate';
import { FinancialPostingsFiltersProvider } from './financialPostingsFilters';

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ForceUpdateProvider>
          <FinancialPostingsFiltersProvider>
            {children}
          </FinancialPostingsFiltersProvider>
        </ForceUpdateProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AppProvider;

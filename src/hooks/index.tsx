import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { ForceUpdateProvider } from './forceUpdate';

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ForceUpdateProvider>{children}</ForceUpdateProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AppProvider;

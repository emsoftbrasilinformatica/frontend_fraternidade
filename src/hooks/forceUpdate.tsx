import React, { createContext, useCallback, useContext } from 'react';
import { differenceInMonths } from 'date-fns';
import { useHistory } from 'react-router-dom';

interface ForceUpdateData {
  forceUpdate(updated_at: string): void;
}

const ForceUpdateContext = createContext<ForceUpdateData>(
  {} as ForceUpdateData,
);

const ForceUpdateProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const forceUpdate = useCallback(
    (updated_at: string) => {
      const monthsDifference = differenceInMonths(
        new Date(),
        new Date(updated_at),
      );

      if (monthsDifference >= 6) {
        history.push('/app/profile');
      }
    },
    [history],
  );

  return (
    <ForceUpdateContext.Provider value={{ forceUpdate }}>
      {children}
    </ForceUpdateContext.Provider>
  );
};

function useForceUpdate(): ForceUpdateData {
  const context = useContext(ForceUpdateContext);

  if (!context) {
    throw new Error('useForceUpdate must be used within a ForceUpdateProvider');
  }

  return context;
}

export { ForceUpdateProvider, useForceUpdate };

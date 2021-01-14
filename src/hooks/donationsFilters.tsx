import React, { createContext, useCallback, useContext, useState } from 'react';

interface DonationsFiltersData {
  startDate: Date;
  setSDate(newValue: Date): void;
  endDate: Date;
  setEDate(newValue: Date): void;
}

const DonationsFiltersContext = createContext<DonationsFiltersData>(
  {} as DonationsFiltersData,
);

const DonationsFiltersProvider: React.FC = ({ children }) => {
  const dateAux = new Date();
  const [startDate, setStartDate] = useState(
    new Date(dateAux.getFullYear(), dateAux.getMonth(), 1),
  );
  const [endDate, setEndDate] = useState(
    new Date(dateAux.getFullYear(), dateAux.getMonth() + 1, 0),
  );

  const setSDate = useCallback((newValue: Date) => {
    setStartDate(newValue);
  }, []);

  const setEDate = useCallback((newValue: Date) => {
    setEndDate(newValue);
  }, []);

  return (
    <DonationsFiltersContext.Provider
      value={{
        startDate,
        setSDate,
        endDate,
        setEDate,
      }}
    >
      {children}
    </DonationsFiltersContext.Provider>
  );
};

function useDonationsFilters(): DonationsFiltersData {
  const context = useContext(DonationsFiltersContext);

  if (!context) {
    throw new Error(
      'useDonationsFilters must be used within a DonationsFiltersProvider',
    );
  }

  return context;
}

export { DonationsFiltersProvider, useDonationsFilters };

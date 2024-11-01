import React, { createContext, useCallback, useContext, useState } from 'react';

interface Option {
  id: string;
  value: string;
}

interface FinancialPostingsFiltersData {
  startDate: Date | null;
  setSDate(newValue: Date | null): void;
  endDate: Date | null;
  setEDate(newValue: Date | null): void;
  selectedTypeFinancialPosting: Option | undefined;
  setTypeFinancialPosting(newValue: Option): void;
  selectedObreiro: Option | undefined;
  setObreiro(newValue: Option): void;
  selectedCostCenter: Option | undefined;
  setCostCenter(newValue: Option): void;
  selectedMov: Option | undefined;
  setMov(newValue: Option): void;
  endDueDate: Date | null;
  setEDueDate(newValue: Date | null): void;
  startDueDate: Date | null;
  setSDueDate(newValue: Date | null): void;
  onlyPays: string;
  setOnlyPaysItem(
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: string,
  ): void;
  endPaydayDate: Date | null;
  setEPaydayDate(newValue: Date | null): void;
  startPaydayDate: Date | null;
  setSPaydayDate(newValue: Date | null): void;
}

const FinancialPostingsFiltersContext = createContext<
  FinancialPostingsFiltersData
>({} as FinancialPostingsFiltersData);

const FinancialPostingsFiltersProvider: React.FC = ({ children }) => {
  const dateAux = new Date();
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(dateAux.getFullYear(), dateAux.getMonth(), 1),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(dateAux.getFullYear(), dateAux.getMonth() + 1, 0),
  );
  const [startDueDate, setStartDueDate] = useState<Date | null>(null);
  const [endDueDate, setEndDueDate] = useState<Date | null>(null);

  const [startPaydayDate, setStartPaydayDate] = useState<Date | null>(null);
  const [endPaydayDate, setEndPaydayDate] = useState<Date | null>(null);

  const [selectedObreiro, setSelectedObreiro] = useState<Option>();
  const [
    selectedTypeFinancialPosting,
    setSelectedTypeFinancialPosting,
  ] = useState<Option>();
  const [selectedCostCenter, setSelectedCostCenter] = useState<Option>();
  const [selectedMov, setSelectedMov] = useState<Option>();
  const [onlyPays, setOnlyPays] = useState('all');

  const setSDate = useCallback((newValue: Date) => {
    setStartDate(newValue);
  }, []);

  const setEDate = useCallback((newValue: Date) => {
    setEndDate(newValue);
  }, []);

  const setSDueDate = useCallback((newValue: Date) => {
    setStartDueDate(newValue);
  }, []);

  const setEDueDate = useCallback((newValue: Date) => {
    setEndDueDate(newValue);
  }, []);

  const setSPaydayDate = useCallback((newValue: Date) => {
    setStartPaydayDate(newValue);
  }, []);

  const setEPaydayDate = useCallback((newValue: Date) => {
    setEndPaydayDate(newValue);
  }, []);

  const setObreiro = useCallback((newValue: Option) => {
    setSelectedObreiro(newValue);
  }, []);

  const setTypeFinancialPosting = useCallback((newValue: Option) => {
    setSelectedTypeFinancialPosting(newValue);
  }, []);

  const setCostCenter = useCallback((newValue: Option) => {
    setSelectedCostCenter(newValue);
  }, []);

  const setMov = useCallback((newValue: Option) => {
    setSelectedMov(newValue);
  }, []);

  const setOnlyPaysItem = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => {
      setOnlyPays(newValue);
    },
    [],
  );

  return (
    <FinancialPostingsFiltersContext.Provider
      value={{
        startDate,
        setSDate,
        endDate,
        setEDate,
        startDueDate,
        setSDueDate,
        endDueDate,
        setEDueDate,
        selectedObreiro,
        setObreiro,
        selectedTypeFinancialPosting,
        setTypeFinancialPosting,
        selectedCostCenter,
        setCostCenter,
        selectedMov,
        setMov,
        onlyPays,
        setOnlyPaysItem,
        startPaydayDate,
        setSPaydayDate,
        endPaydayDate,
        setEPaydayDate,
      }}
    >
      {children}
    </FinancialPostingsFiltersContext.Provider>
  );
};

function useFinancialPostingsFilters(): FinancialPostingsFiltersData {
  const context = useContext(FinancialPostingsFiltersContext);

  if (!context) {
    throw new Error(
      'useFinancialPostingsFilters must be used within a FinancialPostingsFiltersProvider',
    );
  }

  return context;
}

export { FinancialPostingsFiltersProvider, useFinancialPostingsFilters };

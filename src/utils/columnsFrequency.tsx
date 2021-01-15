import React from 'react';

import { Column } from 'material-table';
import { Chip } from '../pages/Frequencies/styles';

interface MonthFrequency {
  totalMonth: number;
  percentMonth: number;
  totalLast12Months: number;
  percentLast12Months: number;
  totalLast24Months: number;
  percentLast24Months: number;
  selectorBackground: number;
}

interface TotalFrequency {
  value: number;
  percent: number;
}

interface Frequency {
  name: string;
  order: number;
  degree: string;
  cim: number;
  january: MonthFrequency;
  february: MonthFrequency;
  march: MonthFrequency;
  april: MonthFrequency;
  may: MonthFrequency;
  june: MonthFrequency;
  july: MonthFrequency;
  august: MonthFrequency;
  september: MonthFrequency;
  october: MonthFrequency;
  november: MonthFrequency;
  december: MonthFrequency;
  total: TotalFrequency;
}

interface ColorsChip {
  background: string;
  color: string;
}

const verifyColorByPercent = (percent: number): ColorsChip => {
  if (percent === 100) {
    return { background: '#12a454', color: '#FFF' };
  }
  if (percent >= 85 && percent < 100) {
    return { background: '#0c4b7e', color: '#FFF' };
  }
  if (percent >= 60 && percent < 85) {
    return { background: '#518fc2', color: '#FFF' };
  }
  if (percent >= 50 && percent < 60) {
    return { background: '#ffa726', color: '#FFF' };
  }
  if (percent < 50) {
    return { background: '#c53030', color: '#FFF' };
  }

  return { background: '', color: '' };
};

export const columns12Months: Column<Frequency>[] = [
  {
    title: 'Nome',
    field: 'name',
    width: 350,
    headerStyle: { zIndex: 0 },
    cellStyle: { zIndex: 0 },
  },
  {
    title: 'CIM',
    field: 'cim',
    width: 100,
    headerStyle: { zIndex: 0 },
    cellStyle: { zIndex: 0 },
  },
  {
    title: 'Grau',
    field: 'degree',
    width: 100,
    headerStyle: { zIndex: 0 },
    cellStyle: { zIndex: 0 },
  },
  {
    title: 'Jan',
    field: 'january.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.january.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Jan',
    field: 'january.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.january.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.january.percentMonth}%`}
        </Chip>
      );
    },
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.january.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
    align: 'center',
  },
  {
    title: '12 Meses',
    field: 'january.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.january.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'january.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.january.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.january.percentLast12Months}%`}
        </Chip>
      );
    },
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.january.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
    align: 'center',
  },
  {
    title: 'Fev',
    field: 'february.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.february.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Fev',
    field: 'february.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.february.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.february.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.february.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'february.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.february.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'february.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.february.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.february.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.february.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Mar',
    field: 'march.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.march.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Mar',
    field: 'march.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.march.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.march.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.march.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'march.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.march.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'march.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.march.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.march.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.march.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Abr',
    field: 'april.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.april.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Abr',
    field: 'april.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.april.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.april.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.april.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'april.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.april.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'april.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.april.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.april.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.april.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Mai',
    field: 'may.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor: rowData.may.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Mai',
    field: 'may.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.may.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.may.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor: rowData.may.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'may.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor: rowData.may.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'may.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.may.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.may.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor: rowData.may.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Jun',
    field: 'june.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.june.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Jun',
    field: 'june.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.june.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.june.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.june.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'june.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.june.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'june.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.june.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.june.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.june.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Jul',
    field: 'july.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.july.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Jul',
    field: 'july.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.july.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.july.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.july.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'july.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.july.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'july.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.july.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.july.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.july.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Ago',
    field: 'august.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.august.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Ago',
    field: 'august.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.august.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.august.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.august.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'august.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.august.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'august.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.august.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.august.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.august.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Set',
    field: 'september.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.september.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Set',
    field: 'september.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.september.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.september.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.september.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'september.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.september.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'september.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(
        rowData.september.percentLast12Months,
      );
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.september.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.september.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Out',
    field: 'october.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.october.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Out',
    field: 'october.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.october.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.october.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.october.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'october.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.october.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'october.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.october.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.october.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.october.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Nov',
    field: 'november.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.november.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Nov',
    field: 'november.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.november.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.november.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.november.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'november.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.november.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'november.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.november.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.november.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.november.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Dez',
    field: 'december.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.december.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Dez',
    field: 'december.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.december.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.december.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.december.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '12 Meses',
    field: 'december.totalLast12Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.december.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 12 Meses',
    field: 'december.percentLast12Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.december.percentLast12Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.december.percentLast12Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.december.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Total Ano',
    field: 'total.value',
    width: 120,
    align: 'center',
  },
  {
    title: '% Total Ano',
    field: 'total.percent',
    width: 150,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.total.percent);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.total.percent}%`}
        </Chip>
      );
    },
    align: 'center',
  },
];

export const columns24Months: Column<Frequency>[] = [
  {
    title: 'Nome',
    field: 'name',
    width: 350,
    headerStyle: { zIndex: 0 },
    cellStyle: { zIndex: 0 },
  },
  {
    title: 'CIM',
    field: 'cim',
    width: 100,
    headerStyle: { zIndex: 0 },
    cellStyle: { zIndex: 0 },
  },
  {
    title: 'Grau',
    field: 'degree',
    width: 100,
    headerStyle: { zIndex: 0 },
    cellStyle: { zIndex: 0 },
  },
  {
    title: 'Jan',
    field: 'january.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.january.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Jan',
    field: 'january.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.january.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.january.percentMonth}%`}
        </Chip>
      );
    },
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.january.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
    align: 'center',
  },
  {
    title: '24 Meses',
    field: 'january.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.january.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'january.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.january.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.january.percentLast24Months}%`}
        </Chip>
      );
    },
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.january.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
    align: 'center',
  },
  {
    title: 'Fev',
    field: 'february.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.february.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Fev',
    field: 'february.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.february.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.february.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.february.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'february.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.february.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'february.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.february.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.february.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.february.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Mar',
    field: 'march.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.march.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Mar',
    field: 'march.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.march.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.march.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.march.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'march.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.march.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'march.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.march.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.march.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.march.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Abr',
    field: 'april.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.april.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Abr',
    field: 'april.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.april.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.april.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.april.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'april.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.april.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'april.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.april.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.april.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.april.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Mai',
    field: 'may.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor: rowData.may.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Mai',
    field: 'may.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.may.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.may.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor: rowData.may.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'may.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor: rowData.may.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'may.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.may.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.may.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor: rowData.may.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Jun',
    field: 'june.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.june.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Jun',
    field: 'june.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.june.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.june.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.june.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'june.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.june.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'june.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.june.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.june.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.june.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Jul',
    field: 'july.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.july.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Jul',
    field: 'july.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.july.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.july.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.july.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'july.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.july.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'july.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.july.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.july.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.july.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Ago',
    field: 'august.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.august.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Ago',
    field: 'august.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.august.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.august.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.august.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'august.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.august.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'august.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.august.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.august.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.august.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Set',
    field: 'september.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.september.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Set',
    field: 'september.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.september.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.september.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.september.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'september.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.september.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'september.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(
        rowData.september.percentLast24Months,
      );
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.september.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.september.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Out',
    field: 'october.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.october.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Out',
    field: 'october.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.october.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.october.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.october.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'october.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.october.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'october.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.october.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.october.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.october.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Nov',
    field: 'november.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.november.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Nov',
    field: 'november.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.november.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.november.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.november.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'november.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.november.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'november.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.november.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.november.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.november.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Dez',
    field: 'december.totalMonth',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.december.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% Dez',
    field: 'december.percentMonth',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.december.percentMonth);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.december.percentMonth}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.december.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '24 Meses',
    field: 'december.totalLast24Months',
    width: 100,
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.december.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: '% 24 Meses',
    field: 'december.percentLast24Months',
    width: 100,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.december.percentLast24Months);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.december.percentLast24Months}%`}
        </Chip>
      );
    },
    align: 'center',
    cellStyle: (_, rowData) => {
      return {
        backgroundColor:
          rowData.december.selectorBackground === 0 ? '#FFF' : '#CCC',
      };
    },
  },
  {
    title: 'Total Ano',
    field: 'total.value',
    width: 120,
    align: 'center',
  },
  {
    title: '% Total Ano',
    field: 'total.percent',
    width: 150,
    render: rowData => {
      const colors = verifyColorByPercent(rowData.total.percent);
      return (
        <Chip backgroundColor={colors.background} color={colors.color}>
          {`${rowData.total.percent}%`}
        </Chip>
      );
    },
    align: 'center',
  },
];

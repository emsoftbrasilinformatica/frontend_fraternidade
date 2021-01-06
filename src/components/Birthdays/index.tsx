import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { Grid } from '@material-ui/core';
import { HiOutlineRefresh } from 'react-icons/hi';
import MaterialTable from 'material-table';
import DayPicker, { DateUtils } from 'react-day-picker';
import {
  format,
  intervalToDuration,
  eachMonthOfInterval,
  addDays,
  toDate,
} from 'date-fns';

import LoadingLocale from '../LoadingLocale';
import {
  Calendar,
  Label,
  BirthdaysContent,
  Button,
  ArroundButton,
} from './styles';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import labels from '../../utils/labels';

interface RangeDate {
  from: Date;
  to: Date;
}

interface User {
  name: string;
  dependents: Dependent[];
  wedding_date: string;
  iniciacao_date: string;
  date_of_birth: string;
}

interface Dependent {
  name: string;
  date_of_birth: string;
  kinship: {
    description: string;
  };
  gender: {
    description: string;
  };
  user: {
    name: string;
  };
}

interface Data {
  date: Date;
  dateFormatted: string;
  type: 'irmao' | 'cunhada' | 'sobrinho' | 'iniciacao' | 'casamento' | string;
  description: string;
}

const Birthdays: React.FC = () => {
  const startDate = new Date();
  const endDate = addDays(new Date(), 6);
  const [loadingDates, setLoadingDates] = useState(false);
  const [birthdaysUsers, setBirthdaysUsers] = useState<User[]>([]);
  const [birthdaysDependents, setBirthdaysDependents] = useState<Dependent[]>(
    [],
  );
  const [weddingDates, setWeddingDates] = useState<User[]>([]);
  const [iniciacaoDates, setIniciacaoDates] = useState<User[]>([]);
  const [range, setRange] = useState<RangeDate>({
    from: startDate,
    to: endDate,
  });
  const modifiers = { start: startDate, end: endDate };
  const { addToast } = useToast();

  useEffect(() => {
    const currentDate = new Date();
    const finalDate = addDays(currentDate, 6);
    const params = {
      start_date: format(currentDate, 'yyyy-MM-dd'),
      end_date: format(finalDate, 'yyyy-MM-dd'),
    };
    setLoadingDates(true);
    Promise.all([
      api.get('/dates/birthdays-users', {
        params,
      }),
      api.get('/dates/birthdays-dependents', {
        params,
      }),
      api.get('/dates/wedding-dates', {
        params,
      }),
      api.get('/dates/iniciacao', {
        params,
      }),
    ])
      .then(values => {
        setBirthdaysUsers(values[0].data);
        setBirthdaysDependents(values[1].data);
        setWeddingDates(values[2].data);
        setIniciacaoDates(values[3].data);
      })
      .finally(() => {
        setLoadingDates(false);
      });
  }, []);

  const handleDayClick = useCallback(
    (day: Date) => {
      const rangeModifier = DateUtils.addDayToRange(day, range);
      setRange(rangeModifier);
      setIniciacaoDates([]);
      setBirthdaysDependents([]);
      setBirthdaysUsers([]);
      setWeddingDates([]);
    },
    [range],
  );

  const handleSearchBirthdays = useCallback(() => {
    if (range.from && range.to) {
      setLoadingDates(true);
      const params = {
        start_date: format(range.from, 'yyyy-MM-dd'),
        end_date: format(range.to, 'yyyy-MM-dd'),
      };
      Promise.all([
        api.get('/dates/birthdays-users', {
          params,
        }),
        api.get('/dates/birthdays-dependents', {
          params,
        }),
        api.get('/dates/wedding-dates', {
          params,
        }),
        api.get('/dates/iniciacao', {
          params,
        }),
      ])
        .then(values => {
          setBirthdaysUsers(values[0].data);
          setBirthdaysDependents(values[1].data);
          setWeddingDates(values[2].data);
          setIniciacaoDates(values[3].data);
        })
        .finally(() => {
          setLoadingDates(false);
        });
    } else {
      addToast({
        title: 'Erro ao buscar datas ',
        description: 'Selecione um período para buscar aniversariantes',
        type: 'error',
      });
    }
  }, [range, addToast]);

  const dataTable: Data[] = useMemo(() => {
    let intervalMonths: Date[];
    if (range.from && range.to) {
      intervalMonths = eachMonthOfInterval({
        start: range.from,
        end: range.to,
      });
    }

    const usersBirthdayFormatted: Data[] = birthdaysUsers.map(el => {
      console.log(toDate(new Date(el.date_of_birth)));
      const dateCreated = new Date(
        `${el.date_of_birth.split('T')[0]}T03:00:00.000Z`,
      );
      const year = intervalMonths.find(
        dateInterval => dateInterval.getMonth() === dateCreated.getMonth(),
      );
      const currentDate = new Date(
        year ? year.getFullYear() : 0,
        dateCreated.getMonth(),
        dateCreated.getDate(),
      );
      return {
        description: `Aniversário Ir∴ ${el.name}`,
        date: currentDate,
        dateFormatted: format(dateCreated, 'dd/MM'),
        type: 'irmao',
      };
    });

    const dependentsBirthdayFormatted: Data[] = birthdaysDependents.map(el => {
      const prefix = el.gender.description === 'Feminino' ? 'a' : 'o';
      let description = '';
      let type = '';
      switch (el.kinship.description) {
        case 'Cônjuge':
          description = `Aniversário Cunhada: ${el.name} - Esposa do Ir∴ ${el.user.name}`;
          type = 'cunhada';
          break;
        case 'Filha(o)':
          description = `Aniversário Sobrinh${prefix}: ${el.name} - Filh${prefix} do Ir∴ ${el.user.name}`;
          type = 'sobrinho';
          break;
        default:
          break;
      }

      const dateCreated = new Date(
        `${el.date_of_birth.split('T')[0]}T03:00:00.000Z`,
      );
      const year = intervalMonths.find(
        dateInterval => dateInterval.getMonth() === dateCreated.getMonth(),
      );
      const currentDate = new Date(
        year ? year.getFullYear() : 0,
        dateCreated.getMonth(),
        dateCreated.getDate(),
      );
      return {
        description,
        date: currentDate,
        dateFormatted: format(dateCreated, 'dd/MM'),
        type,
      };
    });

    const weddingDatesFormatted: Data[] = weddingDates.map(el => {
      const wife = el.dependents.find(
        dependent => dependent.kinship.description === 'Cônjuge',
      )?.name;

      const dateCreated = new Date(el.wedding_date);
      const year = intervalMonths.find(
        dateInterval => dateInterval.getMonth() === dateCreated.getMonth(),
      );
      const currentDate = new Date(
        year ? year.getFullYear() : 0,
        dateCreated.getMonth(),
        dateCreated.getDate(),
      );
      return {
        description: `Casamento: Ir∴ ${el.name} e ${wife}`,
        date: currentDate,
        dateFormatted: format(dateCreated, 'dd/MM'),
        type: 'casamento',
      };
    }, []);

    const iniciacaoDateFormatted: Data[] = iniciacaoDates.map(el => {
      const date = new Date(`${el.iniciacao_date.split('T')[0]}T03:00:00.000Z`);
      const year = intervalMonths.find(
        dateInterval => dateInterval.getMonth() === date.getMonth(),
      );
      const currentDate = new Date(
        year ? year.getFullYear() : 0,
        date.getMonth(),
        date.getDate(),
      );
      const interval = intervalToDuration({ start: date, end: currentDate });

      return {
        description: `Iniciação: Ir∴ ${el.name} (${format(
          date,
          'dd/MM/yyyy',
        )}) - ${interval.years} ano(s)`,
        dateFormatted: format(date, 'dd/MM'),
        date: currentDate,
        type: 'iniciacao',
      };
    });

    return [
      ...usersBirthdayFormatted,
      ...dependentsBirthdayFormatted,
      ...weddingDatesFormatted,
      ...iniciacaoDateFormatted,
    ].sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      }
      if (b.date > a.date) {
        return -1;
      }
      return 0;
    });
  }, [
    birthdaysUsers,
    birthdaysDependents,
    weddingDates,
    iniciacaoDates,
    range,
  ]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <BirthdaysContent>
          <div className="header">
            <div className="title">Aniversariantes</div>
            <ArroundButton>
              <Button onClick={handleSearchBirthdays}>
                <HiOutlineRefresh size={32} />
              </Button>
            </ArroundButton>
          </div>
          <div className="selectedRange">
            {!range.from && !range.to && (
              <Label>Selecione a primeira data</Label>
            )}
            {range.from && !range.to && <Label>Selecione a última data</Label>}
            {range.from && range.to && (
              <Label>
                {range.from.toLocaleDateString()} até &nbsp;
                {range.to.toLocaleDateString()}
              </Label>
            )}
          </div>
        </BirthdaysContent>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            modifiers={modifiers}
            selectedDays={[range.from, { from: range.from, to: range.to }]}
            onDayClick={handleDayClick}
            showOutsideDays
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Grid>
      <Grid item xs={12} md={6}>
        {loadingDates ? (
          <LoadingLocale />
        ) : (
          <MaterialTable
            title="Datas"
            localization={labels.materialTable.localization}
            columns={[
              {
                title: 'Data',
                field: 'dateFormatted',
                width: '15%',
                sorting: false,
              },
              {
                title: 'Descrição',
                field: 'description',
                width: '85%',
                sorting: false,
              },
            ]}
            data={dataTable}
            style={{ border: '2px solid #0f5e9e' }}
            options={{
              pageSize: 20,
              headerStyle: {
                zIndex: 0,
              },
              maxBodyHeight: 365,
              search: false,
              rowStyle: rowData => {
                if (
                  rowData.dateFormatted === format(startDate, 'dd/MM') &&
                  (rowData.type === 'irmao' || rowData.type === 'cunhada')
                ) {
                  return {
                    backgroundColor: '#6b9ec7',
                    color: '#FFF',
                    fontWeight: 500,
                  };
                }
                return {};
              },
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Birthdays;

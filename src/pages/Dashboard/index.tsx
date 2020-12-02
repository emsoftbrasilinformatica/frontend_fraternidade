import React, { useState, useCallback, useMemo } from 'react';

import { Container, Grid } from '@material-ui/core';
import { HiOutlineRefresh } from 'react-icons/hi';
import MaterialTable from 'material-table';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { format, intervalToDuration, eachMonthOfInterval } from 'date-fns';
import BasePage from '../../components/BasePage';
import { useToast } from '../../hooks/toast';
import LoadingLocale from '../../components/LoadingLocale';
import {
  Calendar,
  Label,
  BirthdaysContent,
  Button,
  ArroundButton,
} from './styles';
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
  description: string;
}

const Dashboard: React.FC = () => {
  const dateAux = new Date();
  const startDate = new Date(dateAux.getFullYear(), dateAux.getMonth(), 1);
  const endDate = new Date(dateAux.getFullYear(), dateAux.getMonth() + 1, 0);
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
      Promise.all([
        api.get('/dates/birthdays-users', {
          params: {
            start_date: format(range.from, 'yyyy-MM-dd'),
            end_date: format(range.to, 'yyyy-MM-dd'),
          },
        }),
        api.get('/dates/birthdays-dependents', {
          params: {
            start_date: format(range.from, 'yyyy-MM-dd'),
            end_date: format(range.to, 'yyyy-MM-dd'),
          },
        }),
        api.get('/dates/wedding-dates', {
          params: {
            start_date: format(range.from, 'yyyy-MM-dd'),
            end_date: format(range.to, 'yyyy-MM-dd'),
          },
        }),
        api.get('/dates/iniciacao', {
          params: {
            start_date: format(range.from, 'yyyy-MM-dd'),
            end_date: format(range.to, 'yyyy-MM-dd'),
          },
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
      const dateCreated = new Date(el.date_of_birth);
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
        dateFormatted: format(new Date(el.date_of_birth), 'dd/MM'),
      };
    });

    const dependentsBirthdayFormatted: Data[] = birthdaysDependents.map(el => {
      const prefix = el.gender.description === 'Feminino' ? 'a' : 'o';
      let description = '';
      switch (el.kinship.description) {
        case 'Cônjuge':
          description = `Aniversário Cunhada: ${el.name} - Esposa do Ir∴ ${el.user.name}`;
          break;
        case 'Filha(o)':
          description = `Aniversário Sobrinh${prefix}: ${el.name} - Filh${prefix} do Ir∴ ${el.user.name}`;
          break;
        default:
          break;
      }

      const dateCreated = new Date(el.date_of_birth);
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
        dateFormatted: format(new Date(el.date_of_birth), 'dd/MM'),
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
        dateFormatted: format(new Date(el.wedding_date), 'dd/MM'),
      };
    }, []);

    const iniciacaoDateFormatted: Data[] = iniciacaoDates.map(el => {
      const date = new Date(el.iniciacao_date);
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
    <BasePage title="Dashboard">
      <Container style={{ marginTop: 32 }}>
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
                {range.from && !range.to && (
                  <Label>Selecione a última data</Label>
                )}
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
                }}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </BasePage>
  );
};

export default Dashboard;

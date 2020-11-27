import React, { useState, useCallback } from 'react';

import { Container, Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { HiOutlineRefresh } from 'react-icons/hi';
import DayPicker, { DayModifiers, DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { format } from 'date-fns';
import BasePage from '../../components/BasePage';
import {
  Calendar,
  Label,
  BirthdaysContent,
  Button,
  ArroundButton,
} from './styles';
import api from '../../services/api';

interface RangeDate {
  from: Date;
  to: Date;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '&.MuiGridListTile-tile': {
        overflow: 'unset',
        backgroundColor: 'red',
      },
    },
    gridList: {
      width: '100%',
      height: 450,
    },
  }),
);

const Dashboard: React.FC = () => {
  const dateAux = new Date();
  const classes = useStyles();
  const [startDate, setStartDate] = useState(
    new Date(dateAux.getFullYear(), dateAux.getMonth(), 1),
  );
  const [endDate, setEndDate] = useState(
    new Date(dateAux.getFullYear(), dateAux.getMonth() + 1, 0),
  );
  const [range, setRange] = useState<RangeDate>({
    from: startDate,
    to: endDate,
  });
  const modifiers = { start: startDate, end: endDate };

  // const handleChangeStartDate = useCallback((date: Date) => {
  //   if (date) {
  //     setStartDate(date);
  //   }
  // }, []);

  // const handleChangeEndDate = useCallback((date: Date) => {
  //   if (date) {
  //     setEndDate(date);
  //   }
  // }, []);

  const handleDayClick = useCallback(
    day => {
      const rangeModifier = DateUtils.addDayToRange(day, range);
      setRange(rangeModifier);
    },
    [range],
  );

  const handleSearchBirthdays = useCallback(() => {
    console.log('clicou');
    Promise.all([
      api.get('/birthdays/users', {
        params: {
          start_date: format(range.from, 'yyyy-MM-dd'),
          end_date: format(range.to, 'yyyy-MM-dd'),
        },
      }),
      api.get('/birthdays/dependents', {
        params: {
          start_date: format(range.from, 'yyyy-MM-dd'),
          end_date: format(range.to, 'yyyy-MM-dd'),
        },
      }),
    ]).then(values => {
      console.log(values);
    });
  }, [range]);

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
        </Grid>
      </Container>
    </BasePage>
  );
};

export default Dashboard;

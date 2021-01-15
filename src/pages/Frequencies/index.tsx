/* eslint-disable array-callback-return */
import React, { useState, useCallback, useMemo } from 'react';

import {
  Container,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';
import DatePicker from 'react-datepicker';
import { Search } from '@material-ui/icons';
import MaterialTable from 'material-table';

import { format, isBefore, isAfter, isEqual } from 'date-fns';
import api from '../../services/api';
import BasePage from '../../components/BasePage';
import { Button, DateRangePickerContent, Label, TotalSessions } from './styles';
import Loading from '../../components/Loading';
import labels from '../../utils/labels';
import { columns12Months, columns24Months } from '../../utils/columnsFrequency';

interface UserData {
  total: number;
  name: string;
  date: string;
  order: number;
}

interface Session {
  date: string;
  session_type: {
    degree: {
      order: number;
    };
  };
}

interface SessionData {
  total: number;
  degree: string;
  order: number;
  date: string;
}

interface User {
  id: string;
  cim: number;
  name: string;
  degree: {
    description: string;
    order: number;
  };
  iniciacao_date: string;
  elevacao_date: string;
  exaltacao_date: string;
  instalacao_date: string;
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

interface NumberSessionsPastDate {
  date: Date;
  totalGrauI: number;
  totalGrauII: number;
  totalGrauIII: number;
}

interface UserPastDate {
  name: string;
  months: UserSessionsPastDate[];
}

interface UserSessionsPastDate {
  date: Date;
  total: number;
}

interface TotalNumbersSessions {
  january: NumberSessions;
  february: NumberSessions;
  march: NumberSessions;
  april: NumberSessions;
  may: NumberSessions;
  june: NumberSessions;
  july: NumberSessions;
  august: NumberSessions;
  september: NumberSessions;
  october: NumberSessions;
  november: NumberSessions;
  december: NumberSessions;
  total: NumberSessionsTotal;
}

interface NumberSessions {
  totalGrauI: number;
  totalGrauII: number;
  totalGrauIII: number;
}

interface NumberSessionsTotal {
  totalGrauI: number;
  totalGrauII: number;
  totalGrauIII: number;
  totalAprendiz: number;
  totalCompanheiro: number;
  totalMestre: number;
}

interface ShootDown {
  name: string;
  iniciacao_date: string;
  elevacao_date: string;
  exaltacao_date: string;
  instalacao_date: string;
  january: ShootDownMonth;
  february: ShootDownMonth;
  march: ShootDownMonth;
  april: ShootDownMonth;
  may: ShootDownMonth;
  june: ShootDownMonth;
  july: ShootDownMonth;
  august: ShootDownMonth;
  september: ShootDownMonth;
  october: ShootDownMonth;
  november: ShootDownMonth;
  december: ShootDownMonth;
  total: ShootDownMonth;
}

interface ShootDownMonth {
  totalGrauI: number;
  totalGrauII: number;
  totalGrauIII: number;
}

interface ShootDownPastDate {
  name: string;
  iniciacao_date: string;
  elevacao_date: string;
  exaltacao_date: string;
  instalacao_date: string;
  data: DataShootDownPastDate[];
}

interface DataShootDownPastDate {
  date: Date;
  totalGrauI: number;
  totalGrauII: number;
  totalGrauIII: number;
}

const Frequencies: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [totalSessions, setTotalSessions] = useState<SessionData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [refMonths, setRefMonths] = useState('12_months');

  const handleChangeStartDate = useCallback((date: Date) => {
    if (date) {
      setStartDate(date);
    }
    setUsersData([]);
    setUsers([]);
    setTotalSessions([]);
    setSessions([]);
  }, []);

  const getMonth = useCallback((date: Date):
    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december'
    | undefined => {
    const month = format(date, 'MMMM').toLowerCase();

    if (
      month === 'january' ||
      month === 'february' ||
      month === 'march' ||
      month === 'april' ||
      month === 'may' ||
      month === 'june' ||
      month === 'july' ||
      month === 'august' ||
      month === 'september' ||
      month === 'october' ||
      month === 'november' ||
      month === 'december'
    ) {
      return month;
    }
    return undefined;
  }, []);

  const handleSearchFrequencies = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get<UserData[]>('/frequencies/frequencies-user'),
      api.get<SessionData[]>('/frequencies/total-sessions'),
      api.get<User[]>('/users/actives'),
      api.get<Session[]>('/sessions'),
    ])
      .then(res => {
        setUsersData(res[0].data);
        setTotalSessions(res[1].data);
        setUsers(res[2].data);
        setSessions(res[3].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChangeRefMonths = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => {
      setLoading(true);
      setRefMonths(newValue);

      setTimeout(() => {
        setLoading(false);
      }, 3000);
    },
    [],
  );

  const totalNumbersSessions12Months: NumberSessionsPastDate[] = useMemo(() => {
    const total: NumberSessionsPastDate[] = [
      {
        date: new Date(startDate.getFullYear(), 0, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 1, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 2, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 3, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 4, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 5, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 6, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 7, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 8, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 9, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 10, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 11, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
    ];

    total.map(item => {
      const date = new Date(item.date);
      const pastDate = new Date(
        date.getFullYear() - 1,
        date.getMonth(),
        date.getDate(),
      );

      totalSessions.map(session => {
        const dateSession = new Date(session.date);
        if (
          (isAfter(dateSession, pastDate) && isBefore(dateSession, date)) ||
          isEqual(date, dateSession)
        ) {
          if (session.order === 1) {
            item.totalGrauI += Number(session.total);
            item.totalGrauII += Number(session.total);
            item.totalGrauIII += Number(session.total);
          } else if (session.order === 2) {
            item.totalGrauII += Number(session.total);
            item.totalGrauIII += Number(session.total);
          } else if (session.order === 3) {
            item.totalGrauIII += Number(session.total);
          }
        }
      });
    });

    return total;
  }, [startDate, totalSessions]);

  const totalNumbersSessions24Months: NumberSessionsPastDate[] = useMemo(() => {
    const total: NumberSessionsPastDate[] = [
      {
        date: new Date(startDate.getFullYear(), 0, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 1, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 2, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 3, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 4, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 5, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 6, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 7, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 8, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 9, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 10, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      {
        date: new Date(startDate.getFullYear(), 11, 1),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
    ];

    total.map(item => {
      const date = new Date(item.date);
      const pastDate = new Date(
        date.getFullYear() - 2,
        date.getMonth(),
        date.getDate(),
      );

      totalSessions.map(session => {
        const dateSession = new Date(session.date);
        if (
          (isAfter(dateSession, pastDate) && isBefore(dateSession, date)) ||
          isEqual(date, dateSession)
        ) {
          if (session.order === 1) {
            item.totalGrauI += Number(session.total);
            item.totalGrauII += Number(session.total);
            item.totalGrauIII += Number(session.total);
          } else if (session.order === 2) {
            item.totalGrauII += Number(session.total);
            item.totalGrauIII += Number(session.total);
          } else if (session.order === 3) {
            item.totalGrauIII += Number(session.total);
          }
        }
      });
    });

    return total;
  }, [startDate, totalSessions]);

  const totalNumbersSessions: TotalNumbersSessions = useMemo(() => {
    const total: TotalNumbersSessions = {
      january: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      february: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      march: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      april: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      may: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      june: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      july: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      august: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      september: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      october: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      november: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      december: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      },
      total: {
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
        totalAprendiz: 0,
        totalCompanheiro: 0,
        totalMestre: 0,
      },
    };

    totalSessions.map(session => {
      if (new Date(session.date).getFullYear() === startDate.getFullYear()) {
        const month = getMonth(new Date(session.date));

        if (session.order === 1) {
          total.total.totalGrauI += Number(session.total);
          total.total.totalGrauII += Number(session.total);
          total.total.totalGrauIII += Number(session.total);
          total.total.totalAprendiz += Number(session.total);
        } else if (session.order === 2) {
          total.total.totalGrauII += Number(session.total);
          total.total.totalGrauIII += Number(session.total);
          total.total.totalCompanheiro += Number(session.total);
        } else if (session.order === 3) {
          total.total.totalGrauIII += Number(session.total);
          total.total.totalMestre += Number(session.total);
        }

        if (month) {
          if (session.order === 1) {
            total[month].totalGrauI += Number(session.total);
            total[month].totalGrauII += Number(session.total);
            total[month].totalGrauIII += Number(session.total);
          } else if (session.order === 2) {
            total[month].totalGrauII += Number(session.total);
            total[month].totalGrauIII += Number(session.total);
          } else if (session.order === 3) {
            total[month].totalGrauIII += Number(session.total);
          }
        }
      }
    });

    return total;
  }, [startDate, totalSessions, getMonth]);

  const totalUserSessions12Months: UserPastDate[] = useMemo(() => {
    const total: UserPastDate[] = users.map(user => {
      return {
        name: user.name,
        months: [
          { date: new Date(startDate.getFullYear(), 0, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 1, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 2, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 3, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 4, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 5, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 6, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 7, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 8, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 9, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 10, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 11, 1), total: 0 },
        ],
      };
    });

    total.map(item => {
      item.months.map(month => {
        const date = new Date(month.date);
        const pastDate = new Date(
          date.getFullYear() - 1,
          date.getMonth(),
          date.getDate(),
        );

        usersData.map(userData => {
          if (userData.name === item.name) {
            const dateToCompare = new Date(userData.date);

            if (
              (isAfter(dateToCompare, pastDate) &&
                isBefore(dateToCompare, date)) ||
              isEqual(date, dateToCompare)
            ) {
              month.total += Number(userData.total);
            }

            // if (isEqual(pastDate, dateToCompare)) {
            //   month.total -= Number(userData.total);
            // }
          }
        });
      });
    });

    return total;
  }, [users, startDate, usersData]);

  const totalUserSessions24Months: UserPastDate[] = useMemo(() => {
    const total: UserPastDate[] = users.map(user => {
      return {
        name: user.name,
        months: [
          { date: new Date(startDate.getFullYear(), 0, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 1, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 2, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 3, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 4, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 5, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 6, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 7, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 8, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 9, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 10, 1), total: 0 },
          { date: new Date(startDate.getFullYear(), 11, 1), total: 0 },
        ],
      };
    });

    total.map(item => {
      item.months.map(month => {
        const date = new Date(month.date);
        const pastDate = new Date(
          date.getFullYear() - 2,
          date.getMonth(),
          date.getDate(),
        );

        usersData.map(userData => {
          if (userData.name === item.name) {
            const dateToCompare = new Date(userData.date);

            if (
              (isAfter(dateToCompare, pastDate) &&
                isBefore(dateToCompare, date)) ||
              isEqual(date, dateToCompare)
            ) {
              month.total += Number(userData.total);
            }
          }
        });
      });
    });

    return total;
  }, [users, startDate, usersData]);

  const shootDown: ShootDown[] = useMemo(() => {
    const datasShootDown: ShootDown[] = users.map(user => {
      return {
        name: user.name,
        iniciacao_date: user.iniciacao_date,
        elevacao_date: user.elevacao_date,
        exaltacao_date: user.exaltacao_date,
        instalacao_date: user.instalacao_date,
        january: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        february: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        march: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        april: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        may: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        june: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        july: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        august: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        september: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        october: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        november: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        december: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
        total: { totalGrauI: 0, totalGrauII: 0, totalGrauIII: 0 },
      };
    });

    datasShootDown.map(dataShootDown => {
      if (
        dataShootDown.iniciacao_date &&
        new Date(dataShootDown.iniciacao_date).getFullYear() ===
          startDate.getFullYear()
      ) {
        const iniciacaoDate = new Date(dataShootDown.iniciacao_date);
        sessions.map(session => {
          const sessionDate = new Date(session.date);
          if (
            iniciacaoDate.getFullYear() === sessionDate.getFullYear() &&
            isBefore(sessionDate, iniciacaoDate) &&
            session.session_type.degree.order === 1
          ) {
            const monthE = getMonth(sessionDate);

            if (monthE) {
              dataShootDown[monthE].totalGrauI += 1;

              dataShootDown.total.totalGrauI += 1;
            }
          }
        });
      }

      if (
        dataShootDown.elevacao_date &&
        new Date(dataShootDown.elevacao_date).getFullYear() ===
          startDate.getFullYear()
      ) {
        const elevacaoDate = new Date(dataShootDown.elevacao_date);
        sessions.map(session => {
          const sessionDate = new Date(session.date);
          if (
            elevacaoDate.getFullYear() === sessionDate.getFullYear() &&
            isBefore(sessionDate, elevacaoDate) &&
            session.session_type.degree.order === 2
          ) {
            const monthE = getMonth(sessionDate);

            if (monthE) {
              dataShootDown[monthE].totalGrauII += 1;

              dataShootDown.total.totalGrauII += 1;
            }
          }
        });
      }

      if (
        dataShootDown.exaltacao_date &&
        new Date(dataShootDown.exaltacao_date).getFullYear() ===
          startDate.getFullYear()
      ) {
        const exaltacaoDate = new Date(dataShootDown.exaltacao_date);
        sessions.map(session => {
          const sessionDate = new Date(session.date);
          if (
            exaltacaoDate.getFullYear() === sessionDate.getFullYear() &&
            isBefore(sessionDate, exaltacaoDate) &&
            session.session_type.degree.order === 3
          ) {
            const monthE = getMonth(sessionDate);

            if (monthE) {
              dataShootDown[monthE].totalGrauIII += 1;

              dataShootDown.total.totalGrauIII += 1;
            }
          }
        });
      }
    });

    return datasShootDown;
  }, [users, getMonth, sessions, startDate]);

  const shootDown12Months: ShootDownPastDate[] = useMemo(() => {
    const total: ShootDownPastDate[] = users.map(user => {
      return {
        name: user.name,
        iniciacao_date: user.iniciacao_date,
        elevacao_date: user.elevacao_date,
        exaltacao_date: user.exaltacao_date,
        instalacao_date: user.instalacao_date,
        data: [
          {
            date: new Date(startDate.getFullYear(), 0 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 1 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 2 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 3 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 4 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 5 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 6 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 7 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 8 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 9 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 10 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 11 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
        ],
      };
    });

    total.map(dataTotal => {
      dataTotal.data.map(item => {
        const date = new Date(item.date);
        const pastDate = new Date(
          date.getFullYear() - 1,
          date.getMonth(),
          date.getDate(),
        );

        sessions.map(session => {
          const dateSession = new Date(session.date);

          if (dataTotal.iniciacao_date) {
            const iniciacaoDate = new Date(dataTotal.iniciacao_date);
            if (
              ((isAfter(dateSession, pastDate) &&
                isBefore(dateSession, date)) ||
                isEqual(date, dateSession)) &&
              isBefore(dateSession, iniciacaoDate) &&
              session.session_type.degree.order === 1
            ) {
              item.totalGrauI += 1;
            }
          }

          if (dataTotal.elevacao_date) {
            const elevacaoDate = new Date(dataTotal.elevacao_date);
            if (
              ((isAfter(dateSession, pastDate) &&
                isBefore(dateSession, date)) ||
                isEqual(date, dateSession)) &&
              isBefore(dateSession, elevacaoDate) &&
              session.session_type.degree.order === 2
            ) {
              item.totalGrauII += 1;
            }
          }

          if (dataTotal.exaltacao_date) {
            const exaltacaoDate = new Date(dataTotal.exaltacao_date);
            if (
              ((isAfter(dateSession, pastDate) &&
                isBefore(dateSession, date)) ||
                isEqual(date, dateSession)) &&
              isBefore(dateSession, exaltacaoDate) &&
              session.session_type.degree.order === 3
            ) {
              item.totalGrauIII += 1;
            }
          }
        });
      });
    });

    return total;
  }, [users, startDate, sessions]);

  const shootDown24Months: ShootDownPastDate[] = useMemo(() => {
    const total: ShootDownPastDate[] = users.map(user => {
      return {
        name: user.name,
        iniciacao_date: user.iniciacao_date,
        elevacao_date: user.elevacao_date,
        exaltacao_date: user.exaltacao_date,
        instalacao_date: user.instalacao_date,
        data: [
          {
            date: new Date(startDate.getFullYear(), 0 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 1 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 2 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 3 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 4 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 5 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 6 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 7 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 8 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 9 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 10 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
          {
            date: new Date(startDate.getFullYear(), 11 + 1, 0),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          },
        ],
      };
    });

    total.map(dataTotal => {
      dataTotal.data.map(item => {
        const date = new Date(item.date);
        const pastDate = new Date(
          date.getFullYear() - 2,
          date.getMonth(),
          date.getDate(),
        );

        sessions.map(session => {
          const dateSession = new Date(session.date);

          if (dataTotal.iniciacao_date) {
            const iniciacaoDate = new Date(dataTotal.iniciacao_date);
            if (
              ((isAfter(dateSession, pastDate) &&
                isBefore(dateSession, date)) ||
                isEqual(date, dateSession)) &&
              isBefore(dateSession, iniciacaoDate) &&
              session.session_type.degree.order === 1
            ) {
              item.totalGrauI += 1;
            }
          }

          if (dataTotal.elevacao_date) {
            const elevacaoDate = new Date(dataTotal.elevacao_date);
            if (
              ((isAfter(dateSession, pastDate) &&
                isBefore(dateSession, date)) ||
                isEqual(date, dateSession)) &&
              isBefore(dateSession, elevacaoDate) &&
              session.session_type.degree.order === 2
            ) {
              item.totalGrauII += 1;
            }
          }

          if (dataTotal.exaltacao_date) {
            const exaltacaoDate = new Date(dataTotal.exaltacao_date);
            if (
              ((isAfter(dateSession, pastDate) &&
                isBefore(dateSession, date)) ||
                isEqual(date, dateSession)) &&
              isBefore(dateSession, exaltacaoDate) &&
              session.session_type.degree.order === 3
            ) {
              item.totalGrauIII += 1;
            }
          }
        });
      });
    });

    return total;
  }, [users, startDate, sessions]);

  const finalData: Frequency[] | undefined = useMemo(() => {
    const frequencies: Frequency[] = users.map(user => {
      return {
        name: user.name,
        order: user.degree.order,
        degree: user.degree.description.substring(0, 1),
        cim: user.cim,
        total: { value: 0, percent: 0 },
        january: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 0,
        },
        february: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 1,
        },
        march: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 0,
        },
        april: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 1,
        },
        may: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 0,
        },
        june: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 1,
        },
        july: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 0,
        },
        august: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 1,
        },
        september: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 0,
        },
        october: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 1,
        },
        november: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 0,
        },
        december: {
          totalMonth: 0,
          percentMonth: 0,
          totalLast12Months: 0,
          percentLast12Months: 0,
          totalLast24Months: 0,
          percentLast24Months: 0,
          selectorBackground: 1,
        },
      };
    });

    usersData.map(userData => {
      if (new Date(userData.date).getFullYear() === startDate.getFullYear()) {
        const monthE = getMonth(new Date(userData.date));
        const frequencyFind = frequencies.find(
          frequency => frequency.name === userData.name,
        );
        const shootDownFind = shootDown.find(
          dataShootDown => dataShootDown.name === userData.name,
        );
        if (frequencyFind && monthE && shootDownFind) {
          frequencyFind[monthE].totalMonth = Number(userData.total);
          switch (userData.order) {
            case 1:
              frequencyFind[monthE].percentMonth = Math.round(
                (frequencyFind[monthE].totalMonth /
                  (totalNumbersSessions[monthE].totalGrauI -
                    shootDownFind[monthE].totalGrauI)) *
                  100,
              );
              break;
            case 2:
              frequencyFind[monthE].percentMonth = Math.round(
                (frequencyFind[monthE].totalMonth /
                  (totalNumbersSessions[monthE].totalGrauII -
                    shootDownFind[monthE].totalGrauII)) *
                  100,
              );
              break;
            case 3:
              frequencyFind[monthE].percentMonth = Math.round(
                (frequencyFind[monthE].totalMonth /
                  (totalNumbersSessions[monthE].totalGrauIII -
                    shootDownFind[monthE].totalGrauIII)) *
                  100,
              );
              break;
            case 4:
              frequencyFind[monthE].percentMonth = Math.round(
                (frequencyFind[monthE].totalMonth /
                  (totalNumbersSessions[monthE].totalGrauIII -
                    shootDownFind[monthE].totalGrauIII)) *
                  100,
              );
              break;
            default:
          }
        }

        frequencies.map(frequency => {
          const shootDownFrequency = shootDown.find(
            dataShootDown => dataShootDown.name === frequency.name,
          );
          frequency.total.value =
            frequency.january.totalMonth +
            frequency.february.totalMonth +
            frequency.march.totalMonth +
            frequency.april.totalMonth +
            frequency.may.totalMonth +
            frequency.june.totalMonth +
            frequency.july.totalMonth +
            frequency.august.totalMonth +
            frequency.september.totalMonth +
            frequency.october.totalMonth +
            frequency.november.totalMonth +
            frequency.december.totalMonth;

          if (shootDownFrequency) {
            if (frequency.order === 1) {
              frequency.total.percent = Math.round(
                (frequency.total.value /
                  (totalNumbersSessions.total.totalGrauI -
                    shootDownFrequency.total.totalGrauI)) *
                  100,
              );
            } else if (frequency.order === 2) {
              frequency.total.percent = Math.round(
                (frequency.total.value /
                  (totalNumbersSessions.total.totalGrauII -
                    shootDownFrequency.total.totalGrauII)) *
                  100,
              );
            } else if (frequency.order === 3 || frequency.order === 4) {
              frequency.total.percent = Math.round(
                (frequency.total.value /
                  (totalNumbersSessions.total.totalGrauIII -
                    shootDownFrequency.total.totalGrauIII)) *
                  100,
              );
            }
          }
        });
      }
    });

    totalUserSessions12Months.map(item => {
      const frequencyFind = frequencies.find(
        frequency => frequency.name === item.name,
      );

      const shootDown12MonthsFind = shootDown12Months.find(
        dataShootDown => dataShootDown.name === item.name,
      );

      if (frequencyFind && shootDown12MonthsFind) {
        item.months.map(month => {
          const monthE = getMonth(month.date);
          const totalSessionsMonth = totalNumbersSessions12Months.find(total =>
            isEqual(total.date, month.date),
          ) || {
            date: new Date(),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          };

          const totalShootDown12Months = shootDown12MonthsFind.data.find(
            total =>
              isEqual(
                new Date(total.date.getFullYear(), total.date.getMonth(), 1),
                month.date,
              ),
          ) || {
            date: new Date(),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          };

          if (monthE) {
            frequencyFind[monthE].totalLast12Months =
              Number(month.total) > 0 ? Number(month.total) : 0;
            switch (frequencyFind.order) {
              case 1:
                if (totalSessionsMonth.totalGrauI > 0) {
                  frequencyFind[monthE].percentLast12Months = Math.round(
                    (frequencyFind[monthE].totalLast12Months /
                      (totalSessionsMonth.totalGrauI -
                        totalShootDown12Months.totalGrauI)) *
                      100,
                  );
                }
                break;
              case 2:
                if (totalSessionsMonth.totalGrauII > 0) {
                  frequencyFind[monthE].percentLast12Months = Math.round(
                    (frequencyFind[monthE].totalLast12Months /
                      (totalSessionsMonth.totalGrauII -
                        totalShootDown12Months.totalGrauII)) *
                      100,
                  );
                }
                break;
              case 3:
                if (totalSessionsMonth.totalGrauIII > 0) {
                  frequencyFind[monthE].percentLast12Months = Math.round(
                    (frequencyFind[monthE].totalLast12Months /
                      (totalSessionsMonth.totalGrauIII -
                        totalShootDown12Months.totalGrauIII)) *
                      100,
                  );
                }
                break;
              case 4:
                if (totalSessionsMonth.totalGrauIII > 0) {
                  frequencyFind[monthE].percentLast12Months = Math.round(
                    (frequencyFind[monthE].totalLast12Months /
                      (totalSessionsMonth.totalGrauIII -
                        totalShootDown12Months.totalGrauIII)) *
                      100,
                  );
                }
                break;
              default:
            }
          }
        });
      }
    });

    totalUserSessions24Months.map(item => {
      const frequencyFind = frequencies.find(
        frequency => frequency.name === item.name,
      );

      const shootDown24MonthsFind = shootDown24Months.find(
        dataShootDown => dataShootDown.name === item.name,
      );

      if (frequencyFind && shootDown24MonthsFind) {
        item.months.map(month => {
          const monthE = getMonth(month.date);
          const totalSessionsMonth = totalNumbersSessions24Months.find(total =>
            isEqual(total.date, month.date),
          ) || {
            date: new Date(),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          };

          const totalShootDown24Months = shootDown24MonthsFind.data.find(
            total =>
              isEqual(
                new Date(total.date.getFullYear(), total.date.getMonth(), 1),
                month.date,
              ),
          ) || {
            date: new Date(),
            totalGrauI: 0,
            totalGrauII: 0,
            totalGrauIII: 0,
          };

          if (monthE) {
            frequencyFind[monthE].totalLast24Months =
              Number(month.total) > 0 ? Number(month.total) : 0;
            switch (frequencyFind.order) {
              case 1:
                if (totalSessionsMonth.totalGrauI > 0) {
                  frequencyFind[monthE].percentLast24Months = Math.round(
                    (frequencyFind[monthE].totalLast24Months /
                      (totalSessionsMonth.totalGrauI -
                        totalShootDown24Months.totalGrauI)) *
                      100,
                  );
                }
                break;
              case 2:
                if (totalSessionsMonth.totalGrauII > 0) {
                  frequencyFind[monthE].percentLast24Months = Math.round(
                    (frequencyFind[monthE].totalLast24Months /
                      (totalSessionsMonth.totalGrauII -
                        totalShootDown24Months.totalGrauII)) *
                      100,
                  );
                }
                break;
              case 3:
                if (totalSessionsMonth.totalGrauIII > 0) {
                  frequencyFind[monthE].percentLast24Months = Math.round(
                    (frequencyFind[monthE].totalLast24Months /
                      (totalSessionsMonth.totalGrauIII -
                        totalShootDown24Months.totalGrauIII)) *
                      100,
                  );
                }
                break;
              case 4:
                if (totalSessionsMonth.totalGrauIII > 0) {
                  frequencyFind[monthE].percentLast24Months = Math.round(
                    (frequencyFind[monthE].totalLast24Months /
                      (totalSessionsMonth.totalGrauIII -
                        totalShootDown24Months.totalGrauIII)) *
                      100,
                  );
                }
                break;
              default:
            }
          }
        });
      }
    });

    return frequencies;
  }, [
    users,
    usersData,
    startDate,
    totalNumbersSessions,
    totalUserSessions12Months,
    totalNumbersSessions12Months,
    getMonth,
    shootDown,
    shootDown12Months,
    shootDown24Months,
    totalNumbersSessions24Months,
    totalUserSessions24Months,
  ]);

  return (
    <BasePage title="Frequências">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <Grid container spacing={2} style={{ marginTop: 16 }}>
              <Grid item xs={12} md={3}>
                <DateRangePickerContent>
                  <Label>Ano referente</Label>
                  <DatePicker
                    name="initial_date"
                    selected={startDate}
                    onChange={handleChangeStartDate}
                    placeholderText="Selecione o ano"
                    startDate={startDate}
                    showYearPicker
                    dateFormat="yyyy"
                    locale="pt-BR"
                  />
                </DateRangePickerContent>
              </Grid>
              <Grid
                item
                xs={12}
                md={3}
                style={{
                  border: '3px solid #0f5e9e',
                  borderRadius: 10,
                  fontWeight: 'bold',
                  padding: 16,
                  backgroundColor: '#FFF',
                }}
              >
                <FormControl component="fieldset">
                  <FormLabel component="legend" style={{ fontWeight: 'bold' }}>
                    Referência de Meses
                  </FormLabel>
                  <RadioGroup
                    aria-label="ref_month"
                    name="ref_month"
                    value={refMonths}
                    onChange={handleChangeRefMonths}
                    style={{ flexDirection: 'row' }}
                  >
                    <FormControlLabel
                      value="12_months"
                      control={<Radio />}
                      label="12 Meses"
                    />
                    <FormControlLabel
                      value="24_months"
                      control={<Radio />}
                      label="24 Meses"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button type="button" onClick={handleSearchFrequencies}>
                  Buscar
                  <Search />
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 16 }}>
              <Grid item xs={12} md={12}>
                <TotalSessions>
                  <div className="title">Total de Sessões (Ano)</div>
                  <div className="content">
                    Aprendiz: {totalNumbersSessions.total.totalAprendiz} |
                    Companheiro: {totalNumbersSessions.total.totalCompanheiro} |
                    Mestre: {totalNumbersSessions.total.totalMestre}
                  </div>
                </TotalSessions>
              </Grid>
            </Grid>

            <MaterialTable
              title=""
              localization={labels.materialTable.localization}
              columns={
                refMonths === '12_months' ? columns12Months : columns24Months
              }
              data={[...finalData]}
              options={{
                pageSize: 41,
                draggable: false,
                headerStyle: {
                  zIndex: 0,
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#6b9ec7',
                },
                fixedColumns: {
                  left: 3,
                },
              }}
              style={{ marginTop: 16, border: '2px solid #0f5e9e', zIndex: 0 }}
            />
          </Container>
        </>
      )}
    </BasePage>
  );
};

export default Frequencies;

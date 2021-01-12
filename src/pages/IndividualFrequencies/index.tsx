/* eslint-disable array-callback-return */
import React, { useCallback, useState, useMemo } from 'react';

import { Container, Grid } from '@material-ui/core';
import { format, isEqual, isAfter, isBefore } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Search } from '@material-ui/icons';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import BasePage from '../../components/BasePage';
import {
  Button,
  DateRangePickerContent,
  Label,
  ContainerProgress,
} from './styles';
import Loading from '../../components/Loading';

interface UserData {
  total: number;
  name: string;
  date: string;
  order: number;
}

interface SessionData {
  total: number;
  degree: string;
  order: number;
  date: string;
}

interface Session {
  date: string;
  session_type: {
    degree: {
      order: number;
    };
  };
}

interface SessionVisit {
  total: number;
  name: string;
  date: string;
}

interface ShootDown {
  name: string;
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

interface Frequency {
  name: string;
  order: number;
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
  selectorBackground: number;
}

interface TotalFrequency {
  value: number;
  percent: number;
}

interface ShootDown12Months {
  name: string;
  data: DataShootDown12Months[];
}

interface DataShootDown12Months {
  date: Date;
  totalGrauI: number;
  totalGrauII: number;
  totalGrauIII: number;
}

interface NumberSessions12Months {
  date: Date;
  totalGrauI: number;
  totalGrauII: number;
  totalGrauIII: number;
}

interface User12Months {
  name: string;
  months: UserSessions12Months[];
}

interface UserSessions12Months {
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
  total: NumberSessions;
}

interface NumberSessions {
  totalGrauI: number;
  totalGrauII: number;
  totalGrauIII: number;
}

interface MonthData {
  totalYear: number;
  percentYear: number;
  total12Months: number;
  percent12Months: number;
  totalMonth: number;
  percentMonth: number;
  totalSessionsMonth: number;
  totalSessionsYear: number;
  totalSessions12Months: number;
}

const IndividualFrequencies: React.FC = () => {
  const dateAux = new Date();
  const [startDate, setStartDate] = useState(
    new Date(dateAux.getFullYear(), dateAux.getMonth(), 1),
  );
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalSessions, setTotalSessions] = useState<SessionData[]>([]);
  const [sessionVisits, setSessionVisits] = useState<SessionVisit[]>([]);
  const { user } = useAuth();

  const handleChangeStartDate = useCallback((date: Date) => {
    if (date) {
      setStartDate(date);
    }
    setUserData([]);
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
      api.get<UserData[]>(`/frequencies/frequencies-user/${user.id}`),
      api.get<SessionData[]>('/frequencies/total-sessions'),
      api.get<Session[]>('/sessions'),
      api.get<SessionVisit[]>(`/session-visits-reports/${user.id}`),
    ])
      .then(res => {
        setUserData(res[0].data);
        setTotalSessions(res[1].data);
        setSessions(res[2].data);
        setSessionVisits(res[3].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const totalNumbersSessions12Months: NumberSessions12Months[] = useMemo(() => {
    const total: NumberSessions12Months[] = [
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

  const shootDown12Months: ShootDown12Months = useMemo(() => {
    const total: ShootDown12Months = {
      name: user.name,
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

    total.data.map(item => {
      const date = new Date(item.date);
      const pastDate = new Date(
        date.getFullYear() - 1,
        date.getMonth(),
        date.getDate(),
      );

      sessions.map(session => {
        const dateSession = new Date(session.date);

        if (user.iniciacao_date) {
          const iniciacaoDate = new Date(user.iniciacao_date);
          if (
            ((isAfter(dateSession, pastDate) && isBefore(dateSession, date)) ||
              isEqual(date, dateSession)) &&
            isBefore(dateSession, iniciacaoDate) &&
            session.session_type.degree.order === 1
          ) {
            item.totalGrauI += 1;
          }
        }

        if (user.elevacao_date) {
          const elevacaoDate = new Date(user.elevacao_date);
          if (
            ((isAfter(dateSession, pastDate) && isBefore(dateSession, date)) ||
              isEqual(date, dateSession)) &&
            isBefore(dateSession, elevacaoDate) &&
            session.session_type.degree.order === 2
          ) {
            item.totalGrauII += 1;
          }
        }

        if (user.exaltacao_date) {
          const exaltacaoDate = new Date(user.exaltacao_date);
          if (
            ((isAfter(dateSession, pastDate) && isBefore(dateSession, date)) ||
              isEqual(date, dateSession)) &&
            isBefore(dateSession, exaltacaoDate) &&
            session.session_type.degree.order === 3
          ) {
            item.totalGrauIII += 1;
          }
        }
      });
    });

    return total;
  }, [user, startDate, sessions]);

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
      },
    };

    totalSessions.map(session => {
      if (new Date(session.date).getFullYear() === startDate.getFullYear()) {
        const month = getMonth(new Date(session.date));

        if (session.order === 1) {
          total.total.totalGrauI += Number(session.total);
          total.total.totalGrauII += Number(session.total);
          total.total.totalGrauIII += Number(session.total);
        } else if (session.order === 2) {
          total.total.totalGrauII += Number(session.total);
          total.total.totalGrauIII += Number(session.total);
        } else if (session.order === 3) {
          total.total.totalGrauIII += Number(session.total);
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

  const totalUserSessions12Months: User12Months = useMemo(() => {
    const total: User12Months = {
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
    total.months.map(month => {
      const date = new Date(month.date);
      const pastDate = new Date(
        date.getFullYear() - 1,
        date.getMonth(),
        date.getDate(),
      );
      userData.map(data => {
        if (data.name === total.name) {
          const dateToCompare = new Date(data.date);

          if (
            (isAfter(dateToCompare, pastDate) &&
              isBefore(dateToCompare, date)) ||
            isEqual(date, dateToCompare)
          ) {
            month.total += Number(data.total);
          }

          // if (isEqual(pastDate, dateToCompare)) {
          //   month.total -= Number(data.total);
          // }
        }
      });
    });

    return total;
  }, [user, startDate, userData]);

  const shootDown: ShootDown = useMemo(() => {
    const dataShootDown: ShootDown = {
      name: user.name,
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

    if (
      user.iniciacao_date &&
      new Date(user.iniciacao_date).getFullYear() === startDate.getFullYear()
    ) {
      const iniciacaoDate = new Date(user.iniciacao_date);
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
      user.elevacao_date &&
      new Date(user.elevacao_date).getFullYear() === startDate.getFullYear()
    ) {
      const elevacaoDate = new Date(user.elevacao_date);
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
      user.exaltacao_date &&
      new Date(user.exaltacao_date).getFullYear() === startDate.getFullYear()
    ) {
      const exaltacaoDate = new Date(user.exaltacao_date);
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

    return dataShootDown;
  }, [user, startDate, sessions, getMonth]);

  const finalData: Frequency | undefined = useMemo(() => {
    const frequencies: Frequency = {
      name: user.name,
      order: user.degree.order,
      total: { value: 0, percent: 0 },
      january: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 0,
      },
      february: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 1,
      },
      march: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 0,
      },
      april: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 1,
      },
      may: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 0,
      },
      june: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 1,
      },
      july: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 0,
      },
      august: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 1,
      },
      september: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 0,
      },
      october: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 1,
      },
      november: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 0,
      },
      december: {
        totalMonth: 0,
        percentMonth: 0,
        totalLast12Months: 0,
        percentLast12Months: 0,
        selectorBackground: 1,
      },
    };

    userData.map(data => {
      if (new Date(data.date).getFullYear() === startDate.getFullYear()) {
        const monthE = getMonth(new Date(data.date));
        if (frequencies && monthE) {
          frequencies[monthE].totalMonth = Number(data.total);
          switch (data.order) {
            case 1:
              frequencies[monthE].percentMonth = Math.round(
                (frequencies[monthE].totalMonth /
                  (totalNumbersSessions[monthE].totalGrauI -
                    shootDown[monthE].totalGrauI)) *
                  100,
              );
              break;
            case 2:
              frequencies[monthE].percentMonth = Math.round(
                (frequencies[monthE].totalMonth /
                  (totalNumbersSessions[monthE].totalGrauII -
                    shootDown[monthE].totalGrauII)) *
                  100,
              );
              break;
            case 3:
              frequencies[monthE].percentMonth = Math.round(
                (frequencies[monthE].totalMonth /
                  (totalNumbersSessions[monthE].totalGrauIII -
                    shootDown[monthE].totalGrauIII)) *
                  100,
              );
              break;
            case 4:
              frequencies[monthE].percentMonth = Math.round(
                (frequencies[monthE].totalMonth /
                  totalNumbersSessions[monthE].totalGrauIII) *
                  100,
              );
              break;
            default:
          }
        }
        frequencies.total.value =
          frequencies.january.totalMonth +
          frequencies.february.totalMonth +
          frequencies.march.totalMonth +
          frequencies.april.totalMonth +
          frequencies.may.totalMonth +
          frequencies.june.totalMonth +
          frequencies.july.totalMonth +
          frequencies.august.totalMonth +
          frequencies.september.totalMonth +
          frequencies.october.totalMonth +
          frequencies.november.totalMonth +
          frequencies.december.totalMonth;

        if (frequencies.order === 1) {
          frequencies.total.percent = Math.round(
            (frequencies.total.value /
              (totalNumbersSessions.total.totalGrauI -
                shootDown.total.totalGrauI)) *
              100,
          );
        } else if (frequencies.order === 2) {
          frequencies.total.percent = Math.round(
            (frequencies.total.value /
              (totalNumbersSessions.total.totalGrauII -
                shootDown.total.totalGrauII)) *
              100,
          );
        } else if (frequencies.order === 3 || frequencies.order === 4) {
          frequencies.total.percent = Math.round(
            (frequencies.total.value /
              (totalNumbersSessions.total.totalGrauIII -
                shootDown.total.totalGrauIII)) *
              100,
          );
        }
      }
    });

    totalUserSessions12Months.months.map(month => {
      const monthE = getMonth(month.date);
      const totalSessionsMonth = totalNumbersSessions12Months.find(total =>
        isEqual(total.date, month.date),
      ) || {
        date: new Date(),
        totalGrauI: 0,
        totalGrauII: 0,
        totalGrauIII: 0,
      };
      const totalShootDown12Months = shootDown12Months.data.find(total =>
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
        frequencies[monthE].totalLast12Months =
          Number(month.total) > 0 ? Number(month.total) : 0;
        switch (frequencies.order) {
          case 1:
            if (totalSessionsMonth.totalGrauI > 0) {
              frequencies[monthE].percentLast12Months = Math.round(
                (frequencies[monthE].totalLast12Months /
                  (totalSessionsMonth.totalGrauI -
                    totalShootDown12Months.totalGrauI)) *
                  100,
              );
            }
            break;
          case 2:
            if (totalSessionsMonth.totalGrauII > 0) {
              frequencies[monthE].percentLast12Months = Math.round(
                (frequencies[monthE].totalLast12Months /
                  (totalSessionsMonth.totalGrauII -
                    totalShootDown12Months.totalGrauII)) *
                  100,
              );
            }
            break;
          case 3:
            if (totalSessionsMonth.totalGrauIII > 0) {
              frequencies[monthE].percentLast12Months = Math.round(
                (frequencies[monthE].totalLast12Months /
                  (totalSessionsMonth.totalGrauIII -
                    totalShootDown12Months.totalGrauIII)) *
                  100,
              );
            }
            break;
          case 4:
            if (totalSessionsMonth.totalGrauIII > 0) {
              frequencies[monthE].percentLast12Months = Math.round(
                (frequencies[monthE].totalLast12Months /
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

    return frequencies;
  }, [
    user,
    userData,
    startDate,
    totalNumbersSessions,
    totalUserSessions12Months,
    totalNumbersSessions12Months,
    getMonth,
    shootDown,
    shootDown12Months,
  ]);

  const monthData: MonthData | undefined = useMemo(() => {
    const month = getMonth(startDate);
    const sessions12Months = totalNumbersSessions12Months.find(
      sessionsData =>
        format(sessionsData.date, 'dd/MM/yyyy') ===
        format(startDate, 'dd/MM/yyyy'),
    );
    const totalShootDown12Months = shootDown12Months.data.find(
      sessionsData =>
        format(sessionsData.date, '01/MM/yyyy') ===
        format(startDate, 'dd/MM/yyyy'),
    ) || {
      date: new Date(),
      totalGrauI: 0,
      totalGrauII: 0,
      totalGrauIII: 0,
    };

    if (month && sessions12Months) {
      let totalSessionsMonth;
      let totalSessionsYear;
      let totalSessions12Months;
      if (user.degree.order === 1) {
        totalSessionsMonth =
          totalNumbersSessions[month].totalGrauI - shootDown[month].totalGrauI;
        totalSessionsYear =
          totalNumbersSessions.total.totalGrauI - shootDown.total.totalGrauI;
        totalSessions12Months =
          sessions12Months.totalGrauI - totalShootDown12Months.totalGrauI;
      } else if (user.degree.order === 2) {
        totalSessionsMonth =
          totalNumbersSessions[month].totalGrauII -
          shootDown[month].totalGrauII;
        totalSessionsYear =
          totalNumbersSessions.total.totalGrauII - shootDown.total.totalGrauII;
        totalSessions12Months =
          sessions12Months.totalGrauII - totalShootDown12Months.totalGrauII;
      } else {
        totalSessionsMonth =
          totalNumbersSessions[month].totalGrauIII -
          shootDown[month].totalGrauIII;
        totalSessionsYear =
          totalNumbersSessions.total.totalGrauIII -
          shootDown.total.totalGrauIII;
        totalSessions12Months =
          sessions12Months.totalGrauIII - totalShootDown12Months.totalGrauIII;
      }
      return {
        totalYear: finalData.total.value,
        percentYear: finalData.total.percent,
        totalMonth: finalData[month].totalMonth,
        percentMonth: finalData[month].percentMonth,
        total12Months: finalData[month].totalLast12Months,
        percent12Months: finalData[month].percentLast12Months,
        totalSessionsMonth,
        totalSessionsYear,
        totalSessions12Months,
      };
    }

    return undefined;
  }, [
    startDate,
    finalData,
    getMonth,
    totalNumbersSessions,
    user,
    totalNumbersSessions12Months,
    shootDown,
    shootDown12Months,
  ]);

  const totalSessionVisitsMonth = useMemo(() => {
    const sessionVisitFind = sessionVisits.find(sessionVisit =>
      isEqual(startDate, new Date(sessionVisit.date)),
    );

    return sessionVisitFind ? sessionVisitFind.total : 0;
  }, [sessionVisits, startDate]);

  const totalSessionVisitsYear = useMemo(() => {
    const firstDate = new Date(startDate.getFullYear(), 0, 1);
    const lastDate = new Date(startDate.getFullYear(), 11 + 1, 0);

    const total = sessionVisits.reduce(
      (acc: number, sessionVisit: SessionVisit) => {
        const date = new Date(sessionVisit.date);
        if (
          (isEqual(date, firstDate) || isAfter(date, firstDate)) &&
          (isEqual(date, lastDate) || isBefore(date, lastDate))
        ) {
          acc += Number(sessionVisit.total);
        }

        return acc;
      },
      0,
    );
    return total;
  }, [startDate, sessionVisits]);

  const totalSessionVisits12Months = useMemo(() => {
    const pastDate = new Date(
      startDate.getFullYear() - 1,
      startDate.getMonth() + 1,
      0,
    );
    const todayDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0,
    );

    const total = sessionVisits.reduce(
      (acc: number, sessionVisit: SessionVisit) => {
        const date = new Date(sessionVisit.date);
        if (
          isAfter(date, pastDate) &&
          (isEqual(date, todayDate) || isBefore(date, todayDate))
        ) {
          acc += Number(sessionVisit.total);
        }

        return acc;
      },
      0,
    );

    return total;
  }, [startDate, sessionVisits]);

  return (
    <BasePage title="Frequência">
      {loading ? (
        <Loading />
      ) : (
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
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  locale="pt-BR"
                />
              </DateRangePickerContent>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button type="button" onClick={handleSearchFrequencies}>
                Buscar
                <Search />
              </Button>
            </Grid>
          </Grid>

          {monthData &&
            (monthData.total12Months > 0 ||
              monthData.totalYear > 0 ||
              monthData.totalMonth > 0) && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <ContainerProgress>
                    <div className="title">No Mês</div>
                    <div className="data">
                      Presentes: {monthData.totalMonth} | Total:{' '}
                      {monthData.totalSessionsMonth}
                    </div>
                    <div className="data">
                      Visitas: {totalSessionVisitsMonth}
                    </div>
                    <div className="content">
                      <CircularProgressbar
                        value={monthData.percentMonth}
                        text={`${monthData.percentMonth}%`}
                        styles={buildStyles({
                          trailColor: '#C53030',
                          pathColor: '#12a454',
                        })}
                      />
                    </div>
                  </ContainerProgress>
                </Grid>

                <Grid item xs={12} md={4}>
                  <ContainerProgress>
                    <div className="title">No Ano</div>
                    <div className="data">
                      Presentes: {monthData.totalYear} | Total:
                      {monthData.totalSessionsYear}
                    </div>
                    <div className="data">
                      Visitas: {totalSessionVisitsYear}
                    </div>
                    <div className="content">
                      <CircularProgressbar
                        value={monthData.percentYear}
                        text={`${monthData.percentYear}%`}
                        styles={buildStyles({
                          trailColor: '#C53030',
                          pathColor: '#12a454',
                        })}
                      />
                    </div>
                  </ContainerProgress>
                </Grid>

                <Grid item xs={12} md={4}>
                  <ContainerProgress>
                    <div className="title">Últimos 12 Meses</div>
                    <div className="data">
                      Presentes: {monthData.total12Months} | Total:
                      {monthData.totalSessions12Months}
                    </div>
                    <div className="data">
                      Visitas: {totalSessionVisits12Months}
                    </div>
                    <div className="content">
                      <CircularProgressbar
                        value={monthData.percent12Months}
                        text={`${monthData.percent12Months}%`}
                        styles={buildStyles({
                          trailColor: '#C53030',
                          pathColor: '#12a454',
                        })}
                      />
                    </div>
                  </ContainerProgress>
                </Grid>
              </Grid>
            )}
        </Container>
      )}
    </BasePage>
  );
};

export default IndividualFrequencies;

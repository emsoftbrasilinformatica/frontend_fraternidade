import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { Container, Grid } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { intervalToDuration, formatDuration, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import {
  Button,
  SelectContainer,
  Label,
  DatesContainer,
  DatesInfo,
} from './styles';
import BasePage from '../../components/BasePage';
import Loading from '../../components/Loading';

interface UserOption {
  id: string;
  name: string;
  label: string;
  value: string;
}

interface UserDates {
  iniciacao_date: string;
  exaltacao_date: string;
  instalacao_date: string;
  elevacao_date: string;
}

interface DateDegree {
  type: string;
  date: string;
  totalTime: string;
  degree: string;
}

interface Option {
  id: string;
  value: string;
}

interface Function {
  start_year: number;
  last_year: number;
  description: string;
}

const Historic: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<Option>();
  const [userDates, setUserDates] = useState<UserDates>();
  const [functions, setFunctions] = useState<Function[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/users/actives').then(res => {
      setUsers(
        res.data.map((userData: UserOption) => {
          return {
            ...userData,
            value: userData.id,
            label: userData.name,
          };
        }),
      );
    });
  }, []);

  const handleChangeObreiro = useCallback(option => {
    if (option) {
      setSelectedUser(option);
    } else {
      setSelectedUser(undefined);
    }
    setFunctions([]);
    setUserDates(undefined);
  }, []);

  const usersToBeSelected: UserOption[] = useMemo(() => {
    if (user.administrative_function?.description === 'Venerável') {
      return users;
    }
    return users.filter(userData => userData.name === user.name);
  }, [user, users]);

  const handleSearchFrequencies = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get<UserDates>(`/users/${selectedUser?.id}`),
      api.get<Function[]>(`/management-members/historic/${selectedUser?.id}`),
    ])
      .then(res => {
        setUserDates(res[0].data);
        setFunctions(res[1].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedUser]);

  const dateDegrees: DateDegree[] = useMemo(() => {
    if (userDates) {
      return [
        {
          type: 'Iniciação',
          degree: 'Aprendiz',
          date: format(new Date(userDates.iniciacao_date), 'dd/MM/yyyy'),
          totalTime: formatDuration(
            intervalToDuration({
              start: new Date(userDates.iniciacao_date),
              end: new Date(),
            }),
            { format: ['years', 'months'], delimiter: ', ', locale: ptBR },
          ),
        },
        {
          type: 'Elevação',
          degree: 'Mestre',
          date: userDates.elevacao_date
            ? format(new Date(userDates.elevacao_date), 'dd/MM/yyyy')
            : ' ---- ',
          totalTime: userDates.elevacao_date
            ? formatDuration(
                intervalToDuration({
                  start: new Date(userDates.elevacao_date),
                  end: new Date(),
                }),
                { format: ['years', 'months'], delimiter: ', ', locale: ptBR },
              )
            : ' ---- ',
        },
        {
          type: 'Exaltação',
          degree: 'Companheiro',
          date: userDates.exaltacao_date
            ? format(new Date(userDates.exaltacao_date), 'dd/MM/yyyy')
            : ' ---- ',
          totalTime: userDates.exaltacao_date
            ? formatDuration(
                intervalToDuration({
                  start: new Date(userDates.exaltacao_date),
                  end: new Date(),
                }),
                { format: ['years', 'months'], delimiter: ', ', locale: ptBR },
              )
            : ' ---- ',
        },
        {
          type: 'Instalação',
          degree: 'Mestre Instalado',
          date: userDates.instalacao_date
            ? format(new Date(userDates.instalacao_date), 'dd/MM/yyyy')
            : ' ---- ',
          totalTime: userDates.instalacao_date
            ? formatDuration(
                intervalToDuration({
                  start: new Date(userDates.instalacao_date),
                  end: new Date(),
                }),
                { format: ['years', 'months'], delimiter: ', ', locale: ptBR },
              )
            : ' ---- ',
        },
      ];
    }
    return [];
  }, [userDates]);
  return (
    <BasePage title="Histórico">
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Grid container spacing={2} style={{ marginTop: 16 }}>
            <Grid item xs={12} md={5}>
              <div>
                <Label>Obreiro</Label>
                <SelectContainer
                  name="type_financial_posting_id"
                  classNamePrefix="react-select"
                  defaultValue={selectedUser}
                  onChange={handleChangeObreiro}
                  placeholder="Selecione..."
                  options={usersToBeSelected}
                  isClearable
                  isSearchable={false}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button type="button" onClick={handleSearchFrequencies}>
                Buscar
                <Search />
              </Button>
            </Grid>
          </Grid>

          <DatesContainer>
            <div className="title">Histórico de Datas</div>
            <Grid container spacing={2}>
              {dateDegrees.map(date => (
                <Grid item xs={12} md={3}>
                  <DatesInfo>
                    <div className="title">{date.type}</div>
                    <div className="subtitle">{date.degree}</div>
                    <div className="info">{date.date}</div>
                    <div className="info">{date.totalTime}</div>
                  </DatesInfo>
                </Grid>
              ))}
            </Grid>
          </DatesContainer>
          <DatesContainer>
            <div className="title">Histórico de Cargos</div>
            <Grid container spacing={2}>
              {functions.map(func => (
                <Grid item xs={12} md={3}>
                  <DatesInfo>
                    <div className="title">{`${func.start_year}/${func.last_year}`}</div>
                    <div className="subtitle">{func.description}</div>
                  </DatesInfo>
                </Grid>
              ))}
            </Grid>
          </DatesContainer>
        </Container>
      )}
    </BasePage>
  );
};

export default Historic;

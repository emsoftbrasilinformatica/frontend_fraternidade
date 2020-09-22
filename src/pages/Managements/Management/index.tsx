import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';

import {
  makeStyles,
  Theme,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import {
  DesktopMac as AdminFuncIcon,
  DesktopAccessDisabled as NotAdminFuncIcon,
} from '@material-ui/icons';
import { Container, Grid, Box, AppBar, Tabs, Tab } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
// import * as Yup from 'yup';

import MaterialTable from 'material-table';
import { FaRegCalendarCheck, FaRegCalendarTimes } from 'react-icons/fa';
import { useToast } from '../../../hooks/toast';
import labels from '../../../utils/labels';
import BasePage from '../../../components/BasePage';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import api from '../../../services/api';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';

interface params {
  id: string;
}

interface Data {
  administrative_function_id: string;
  administrative_function: string;
  user_id: string | undefined;
}

interface Management {
  id: string;
  start_year: string;
  last_year: string;
}

interface ManagementMember {
  id?: string;
  user_id: string;
  administrative_function_id: string;
}

interface User {
  id: string;
  name: string;
}

interface AdministrativeFunction {
  id: string;
  description: string;
}

interface Acc {
  [key: string]: string;
}

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps): any {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </div>
  );
}

function a11yProps(index: any): any {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: 24,
    borderRadius: 10,
  },
  topTab: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  tableAddresses: {
    marginTop: 16,
    border: '1px solid red',
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#631925',
    },
    secondary: {
      main: '#631925',
    },
  },
});

const Management: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const params: params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const { addToast } = useToast();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [management, setManagement] = useState<Management>();
  const [managementMembers, setManagementMembers] = useState<
    ManagementMember[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const [administrativeFunctions, setAdministrativeFunctions] = useState<
    AdministrativeFunction[]
  >([]);
  const [notAdministrativeFunctions, setNotAdministrativeFunctions] = useState<
    AdministrativeFunction[]
  >([]);

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number,
  ): any => {
    setValue(newValue);
  };

  const handleSubmit = useCallback(
    async data => {
      setLoading(true);
      try {
        const managementMemberToBeCreated: ManagementMember[] = managementMembers.map(
          member => {
            return {
              user_id: member.user_id,
              administrative_function_id: member.administrative_function_id,
            };
          },
        );

        await api.post(`/managements/${params.id}`, {
          users: managementMemberToBeCreated,
        });

        history.push('/app/gestoes');
        setLoading(false);
        addToast({
          type: 'success',
          title: 'Membros da gestão cadastrados com sucesso!',
        });
      } catch (err) {
        setLoading(false);
        addToast({
          type: 'error',
          title: 'Erro ao cadastrar membeos da gestão, tente novamente!',
        });
      }
    },
    [managementMembers, params.id, history, addToast],
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/managements/${params.id}`),
      api.get('/users'),
      api.get('/administrative-functions'),
      api.get('/administrative-functions/not-admin'),
    ])
      .then(values => {
        setManagement(values[0].data);
        setManagementMembers(values[0].data.management_members);
        setUsers(values[1].data);
        setAdministrativeFunctions(values[2].data);
        setNotAdministrativeFunctions(values[3].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  const administrativeFunctionsLookup = useMemo(() => {
    const data = administrativeFunctions.reduce((acc: Acc, cv) => {
      acc[cv.id] = cv.description;
      return acc;
    }, {});
    return data;
  }, [administrativeFunctions]);

  const notAdministrativeFunctionsLookup = useMemo(() => {
    const data = notAdministrativeFunctions.reduce((acc: Acc, cv) => {
      acc[cv.id] = cv.description;
      return acc;
    }, {});
    return data;
  }, [notAdministrativeFunctions]);

  const usersLookup = useMemo(() => {
    const data = users.reduce((acc: Acc, cv) => {
      acc[cv.id] = cv.name;
      return acc;
    }, {});
    return data;
  }, [users]);

  const dataTable = useMemo(() => {
    const data: Data[] = administrativeFunctions.map(admin => {
      return {
        administrative_function_id: admin.id,
        administrative_function: admin.description,
        user_id: managementMembers.find(
          member => member.administrative_function_id === admin.id,
        )?.user_id,
      };
    });
    return data;
  }, [administrativeFunctions, managementMembers]);

  const dataTableNotAdmin = useMemo(() => {
    const data: Data[] = notAdministrativeFunctions.map(admin => {
      return {
        administrative_function_id: admin.id,
        administrative_function: admin.description,
        user_id: managementMembers.find(
          member => member.administrative_function_id === admin.id,
        )?.user_id,
      };
    });
    return data;
  }, [notAdministrativeFunctions, managementMembers]);

  return (
    <ThemeProvider theme={theme}>
      <BasePage title="Editar Gestão" backLink="/app/gestoes">
        {loading ? (
          <Loading />
        ) : (
          <Container>
            <Form
              ref={formRef}
              initialData={management}
              onSubmit={handleSubmit}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit">SALVAR</Button>
              </div>
              <Card title="Informações da Gestão">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Input
                      name="start_year"
                      placeholder="Digite o Ano Inicial"
                      label="Ano Inicial"
                      type="number"
                      icon={FaRegCalendarCheck}
                      readOnly
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Input
                      name="last_year"
                      placeholder="Digite o Ano Final"
                      label="Ano Final"
                      type="number"
                      icon={FaRegCalendarTimes}
                      readOnly
                    />
                  </Grid>
                </Grid>
              </Card>

              <div className={classes.root}>
                <AppBar position="static" className={classes.topTab}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="on"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="scrollable force tabs example"
                  >
                    <Tab
                      label="Funcões Administrativas"
                      icon={<AdminFuncIcon />}
                      {...a11yProps(0)}
                    />
                    <Tab
                      label="Outras Funções"
                      icon={<NotAdminFuncIcon />}
                      {...a11yProps(1)}
                    />
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                  <MaterialTable
                    title="Funções Administrativas"
                    localization={labels.materialTable.localization}
                    columns={[
                      {
                        title: 'Função Administrativa',
                        field: 'administrative_function_id',
                        editable: 'never',
                        lookup: administrativeFunctionsLookup,
                      },
                      {
                        title: 'Usuário',
                        field: 'user_id',
                        editable: 'onUpdate',
                        lookup: usersLookup,
                      },
                    ]}
                    data={dataTable}
                    style={{ marginTop: 16, border: '2px solid #631925' }}
                    options={{
                      headerStyle: {
                        zIndex: 0,
                      },
                    }}
                    editable={{
                      onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            const existingMember = managementMembers.find(
                              member =>
                                member.administrative_function_id ===
                                newData.administrative_function_id,
                            );

                            if (existingMember) {
                              const otherMembers = managementMembers.filter(
                                member => {
                                  if (
                                    member.administrative_function_id !==
                                    newData.administrative_function_id
                                  ) {
                                    if (member.user_id === newData.user_id) {
                                      return member;
                                    }
                                  }
                                  return null;
                                },
                              );

                              if (otherMembers.length === 0) {
                                const managementMembersUpdated = managementMembers.map(
                                  member => {
                                    if (
                                      member.administrative_function_id ===
                                      newData.administrative_function_id
                                    ) {
                                      if (newData.user_id) {
                                        member.user_id = newData.user_id;
                                      }
                                    }
                                    return member;
                                  },
                                );
                                setManagementMembers(managementMembersUpdated);
                              }
                            } else if (newData.user_id) {
                              const userAssigned = managementMembers.find(
                                member => member.user_id === newData.user_id,
                              );

                              if (!userAssigned) {
                                const member = {
                                  administrative_function_id:
                                    newData.administrative_function_id,
                                  user_id: newData.user_id,
                                };

                                setManagementMembers([
                                  ...managementMembers,
                                  member,
                                ]);
                              }
                            }
                            resolve();
                          }, 1000);
                        }),
                    }}
                  />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <MaterialTable
                    title="Outras Funções"
                    localization={labels.materialTable.localization}
                    columns={[
                      {
                        title: 'Função',
                        field: 'administrative_function_id',
                        editable: 'never',
                        lookup: notAdministrativeFunctionsLookup,
                      },
                      {
                        title: 'Usuário',
                        field: 'user_id',
                        editable: 'onUpdate',
                        lookup: usersLookup,
                      },
                    ]}
                    data={dataTableNotAdmin}
                    style={{ marginTop: 16, border: '2px solid #631925' }}
                    options={{
                      headerStyle: {
                        zIndex: 0,
                      },
                    }}
                    editable={{
                      onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            const existingMember = managementMembers.find(
                              member =>
                                member.administrative_function_id ===
                                newData.administrative_function_id,
                            );

                            if (existingMember) {
                              const otherMembers = managementMembers.filter(
                                member => {
                                  if (
                                    member.administrative_function_id !==
                                    newData.administrative_function_id
                                  ) {
                                    if (member.user_id === newData.user_id) {
                                      return member;
                                    }
                                  }
                                  return null;
                                },
                              );

                              if (otherMembers.length === 0) {
                                const managementMembersUpdated = managementMembers.map(
                                  member => {
                                    if (
                                      member.administrative_function_id ===
                                      newData.administrative_function_id
                                    ) {
                                      if (newData.user_id) {
                                        member.user_id = newData.user_id;
                                      }
                                    }
                                    return member;
                                  },
                                );
                                setManagementMembers(managementMembersUpdated);
                              }
                            } else if (newData.user_id) {
                              const userAssigned = managementMembers.find(
                                member => member.user_id === newData.user_id,
                              );

                              if (!userAssigned) {
                                const member = {
                                  administrative_function_id:
                                    newData.administrative_function_id,
                                  user_id: newData.user_id,
                                };

                                setManagementMembers([
                                  ...managementMembers,
                                  member,
                                ]);
                              }
                            }
                            resolve();
                          }, 1000);
                        }),
                    }}
                  />
                </TabPanel>
              </div>
            </Form>
          </Container>
        )}
      </BasePage>
    </ThemeProvider>
  );
};

export default Management;

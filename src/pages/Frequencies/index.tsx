/* eslint-disable array-callback-return */
import React, {
  useState,
  useCallback,
  useMemo,
  // useEffect,
  useRef,
  // ReactElement,
} from 'react';
import { saveAs } from 'file-saver';
import {
  Container,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // CircularProgress,
  // createMuiTheme,
  // makeStyles,
  // Theme,
  // createStyles,
  // TextField,
} from '@material-ui/core';
import DatePicker from 'react-datepicker';
import { Search, Print, HourglassEmpty } from '@material-ui/icons';
import MaterialTable from 'material-table';
import _ from 'underscore';
import { format, add, endOfMonth } from 'date-fns';
import { pdf } from '@react-pdf/renderer';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

// import { Autocomplete } from '@material-ui/lab';
// import { startOfMonth } from 'date-fns';
import api from '../../services/api';
import BasePage from '../../components/BasePage';
import { Button, DateRangePickerContent, Label, TotalSessions } from './styles';
import Loading from '../../components/Loading';
import labels from '../../utils/labels';
import { columns12Months, columns24Months } from '../../utils/columnsFrequency';
import FrequenciesReport from '../FrequenciesReport';
// import Input from '../../components/Input';
import Select from '../../components/Select';
import { FinancialPosting } from '../NonPayments';

// interface UserData {
//   total: number;
//   name: string;
//   date: string;
//   order: number;
// }

// interface Session {
//   date: string;
//   session_type: {
//     degree: {
//       order: number;
//     };
//   };
// }

interface SessionData {
  total: number;
  degree: string;
  order: number;
  date: string;
}

// interface User {
//   id: string;
//   cim: number;
//   name: string;
//   degree: {
//     description: string;
//     order: number;
//   };
//   iniciacao_date: string;
//   elevacao_date: string;
//   exaltacao_date: string;
//   instalacao_date: string;
//   initial_session_date: string;
// }

export interface Frequency {
  id: string;
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

// interface NumberSessionsPastDate {
//   date: Date;
//   totalGrauI: number;
//   totalGrauII: number;
//   totalGrauIII: number;
// }

// interface UserPastDate {
//   name: string;
//   months: UserSessionsPastDate[];
// }

// interface UserSessionsPastDate {
//   date: Date;
//   total: number;
// }

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

// interface ShootDownMonth {
//   totalGrauI: number;
//   totalGrauII: number;
//   totalGrauIII: number;
// }

// interface ShootDownPastDate {
//   name: string;
//   iniciacao_date: string;
//   elevacao_date: string;
//   exaltacao_date: string;
//   instalacao_date: string;
//   data: DataShootDownPastDate[];
// }

// interface DataShootDownPastDate {
//   date: Date;
//   totalGrauI: number;
//   totalGrauII: number;
//   totalGrauIII: number;
// }

export interface SessionPresencesSummary {
  reference_date: string;
  total_sessions: number;
  presences: number;
  total_sessions_twelve_months: number;
  presences_twelve_months: number;
  total_sessions_twenty_four_months: number;
  presences_twenty_four_months: number;
}

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     dialog: {
//       '& .MuiPaper-root': {
//         overflow: 'visible',
//       },
//     },
//   }),
// );

const Frequencies: React.FC = () => {
  // const classes = useStyles();
  const formRef = useRef<FormHandles>(null);
  const [totalSessions, setTotalSessions] = useState<SessionData[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const handleChangeStartDate = useCallback((date: Date) => {
    if (date) {
      setStartDate(date);
    }
    setTotalSessions([]);
  }, []);

  const [periodoInadimplencia, setPeriodoInadimplencia] = useState({
    value: '1',
    label: '1 mês',
  });

  const [loading, setLoading] = useState(false);
  const [sessionsSummary, setSessionsSummary] = useState<Frequency[]>([]);
  const [refMonths, setRefMonths] = useState('12_months');
  const [openModal, setOpenModal] = useState(false);
  const openModalHandle = useCallback(
    status => {
      setOpenModal(status);
    },
    [setOpenModal],
  );
  const [startModalDate, setStartModalDate] = useState(new Date());
  const [refModalMonths, setRefModalMonths] = useState('12_months');
  const handleChangeStartModalDate = useCallback((date: Date) => {
    if (date) {
      setStartModalDate(date);
    }
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

  const mapSummary = useCallback(
    data => {
      const grouped = _.groupBy(data, 'cim');
      const mapped = Object.keys(grouped).map(key => {
        return grouped[key].reduce((acc, cv, idx) => {
          const total = {
            presences:
              Number.parseFloat(cv.presences) +
              (acc?.total?.value !== undefined ? acc?.total?.value : 0),
            sessions:
              Number.parseFloat(cv.total_sessions) +
              (acc?.total?.sessions !== undefined ? acc?.total?.sessions : 0),
          };
          return {
            ...acc,
            id: cv.id,
            cim: cv.cim,
            degree: `${cv.degree}`
              .toUpperCase()
              .split(' ')
              .map(el => el[0])
              .join(''),
            name: cv.name,
            order: cv.order,
            total: {
              value: total.presences,
              percent:
                `${total.sessions}` === '0'
                  ? 100
                  : Math.round(
                      (Number.parseFloat(total.presences) * 100) /
                        Number.parseFloat(total.sessions),
                    ),
              sessions: total.sessions,
            },
            [`${getMonth(new Date(cv.reference_date))}`]: {
              totalMonth: Number.parseFloat(cv.presences),
              percentMonth:
                `${cv.total_sessions}` === '0'
                  ? 100
                  : Math.round(
                      (Number.parseFloat(cv.presences) * 100) /
                        Number.parseFloat(cv.total_sessions),
                    ),
              totalLast12Months: Number.parseFloat(cv.presences_twelve_months),
              percentLast12Months:
                `${cv.total_sessions_twelve_months}` === '0'
                  ? 100
                  : Math.round(
                      (Number.parseFloat(cv.presences_twelve_months) * 100) /
                        Number.parseFloat(cv.total_sessions_twelve_months),
                    ),
              totalLast24Months: Number.parseFloat(
                cv.presences_twenty_four_months,
              ),
              percentLast24Months:
                `${cv.total_sessions_twenty_four_months}` === '0'
                  ? 100
                  : Math.round(
                      (Number.parseFloat(cv.presences_twenty_four_months) *
                        100) /
                        Number.parseFloat(cv.total_sessions_twenty_four_months),
                    ),
              selectorBackground: idx % 2,
            },
          };
        }, {});
      });
      return _.sortBy(mapped, 'name');
    },
    [getMonth],
  );

  const handleSearchFrequencies = useCallback(() => {
    setLoading(true);

    Promise.all([
      api.get<SessionPresencesSummary[]>(
        `/frequencies/summary/${startDate.getFullYear()}-12-01`,
      ),
      api.get<SessionData[]>('/frequencies/total-sessions'),
    ])
      .then(res => {
        setSessionsSummary(mapSummary(res[0].data));
        setTotalSessions(res[1].data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mapSummary, startDate]);

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

    totalSessions.forEach(session => {
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

  const quantItens = useMemo(() => {
    let n = Math.floor((window.screen.availHeight - 250) / 65);
    n = n < 5 ? 5 : n;
    return n;
  }, []);

  const fixedColumns = useMemo(() => {
    if (window.screen.availWidth <= 600) {
      return {
        tableLayout: 'fixed',
      };
    }
    if (window.screen.availWidth < 800) {
      return {
        fixedColumns: {
          left: 1,
        },
      };
    }
    return {
      fixedColumns: {
        left: 3,
      },
    };
  }, []);

  const handleChangeRefModalMonths = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => {
      setRefModalMonths(newValue);
    },
    [],
  );
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const printReportHandle = useCallback(async () => {
    setLoadingReport(true);

    const paymentReferenceDate =
      startModalDate.getFullYear() === new Date().getFullYear() &&
      startModalDate.getMonth() === new Date().getMonth()
        ? new Date()
        : endOfMonth(startModalDate);

    Promise.all([
      api.get<SessionPresencesSummary[]>(
        `/frequencies/summary/${startModalDate.getFullYear()}-12-01`,
      ),
      api.get<FinancialPosting[]>('/non-monthly-payments/all', {
        params: {
          date: format(paymentReferenceDate, 'yyyy-MM-dd'),
        },
      }),
    ]).then(async res => {
      const inadimplentes = (res[1].data as any).reduce(
        (acc: number[], cv: FinancialPosting) => {
          if (
            new Date(cv?.due_date ?? '') <
            add(paymentReferenceDate, {
              months: (Number.parseFloat(periodoInadimplencia.value) - 1) * -1,
            })
          ) {
            if (cv !== undefined) {
              return [...acc, Number.parseFloat(cv?.obreiro?.cim ?? '')];
            }
          }
          return acc;
        },
        [] as number[],
      );

      const reportData = mapSummary(res[0].data) as Frequency[];

      const doc = (
        <FrequenciesReport
          frequenciesSummary={reportData}
          referenceDate={startModalDate}
          monthsGroup={refModalMonths}
          inadimplentes={inadimplentes}
          inadimplentesPeriodo={Number.parseFloat(periodoInadimplencia.value)}
        />
      );
      const asPdf = pdf([] as any);
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      saveAs(
        blob,
        `relatorio_frequencia_${`${startModalDate.getMonth() + 1}`.padStart(
          2,
          '0',
        )}_${startModalDate.getFullYear()}.pdf`,
      );
      setLoadingReport(false);
    });
  }, [startModalDate, mapSummary, refModalMonths, periodoInadimplencia]);

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
              <Grid item xs={12} md={2}>
                <Button type="button" onClick={handleSearchFrequencies}>
                  Buscar
                  <Search />
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button type="button" onClick={openModalHandle}>
                  Relatório
                  <Print />
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
              data={[...sessionsSummary]}
              options={{
                pageSize: quantItens,
                draggable: false,
                headerStyle: {
                  zIndex: 0,
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#6b9ec7',
                },
                ...(fixedColumns as any),
              }}
              style={{ marginTop: 16, border: '2px solid #0f5e9e', zIndex: 0 }}
            />
          </Container>
        </>
      )}
      <>
        <Dialog
          open={openModal}
          onClose={() => {
            openModalHandle(false);
          }}
          aria-labelledby="alert-dialog-report-title"
          aria-describedby="alert-dialog-report-description"
          id="alert-dialog-report"
        >
          <Form ref={formRef} onSubmit={() => {}}>
            <DialogTitle id="alert-dialog-report-title">
              Relatório de Frequências
            </DialogTitle>
            <DialogContent
              id="alert-dialog-report-content"
              style={{ overflow: 'visible' }}
            >
              <DateRangePickerContent>
                <Label>Data de referência</Label>
                <DatePicker
                  name="initial_modal_date"
                  selected={startModalDate}
                  onChange={handleChangeStartModalDate}
                  placeholderText="Selecione o ano"
                  startDate={startModalDate}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  locale="pt-BR"
                />
              </DateRangePickerContent>

              <FormControl component="fieldset" style={{ marginTop: 10 }}>
                <FormLabel
                  component="legend"
                  style={{
                    fontWeight: 'bold',
                    color: '#0f5e9e',
                    marginLeft: 5,
                  }}
                >
                  Periodo de Referência
                </FormLabel>
                <div
                  style={{
                    border: '3px solid #0f5e9e',
                    borderRadius: 10,
                    fontWeight: 'bold',
                    padding: 14,
                  }}
                >
                  <RadioGroup
                    aria-label="ref_month"
                    name="ref_month"
                    value={refModalMonths}
                    onChange={handleChangeRefModalMonths}
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
                </div>
              </FormControl>

              <div style={{ marginTop: 10 }}>
                <Select
                  name="inadimplencia"
                  label="Periodo de inadimplência"
                  placeholder="Selecione periodo de inadimplência"
                  value={[periodoInadimplencia]}
                  onChange={value => {
                    setPeriodoInadimplencia(
                      value as { value: string; label: string },
                    );
                  }}
                  pageSize={3}
                  options={[
                    { value: '1', label: '1 mês' },
                    { value: '2', label: '2 meses' },
                    { value: '3', label: '3 meses' },
                    { value: '4', label: '4 meses' },
                  ]}
                  menuPosition="fixed"
                  menuPlacement="top"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  openModalHandle(false);
                }}
                color="primary"
                type="button"
              >
                Fechar
              </Button>
              <Button
                type="button"
                disabled={loadingReport}
                onClick={printReportHandle}
              >
                Relatório
                {loadingReport ? <HourglassEmpty /> : <Print />}
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      </>
    </BasePage>
  );
};

export default Frequencies;

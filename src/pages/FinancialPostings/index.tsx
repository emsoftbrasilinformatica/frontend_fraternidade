import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import DatePicker from 'react-datepicker';
import MaterialTable from 'material-table';
import {
  Container,
  SwipeableDrawer,
  Divider,
  IconButton,
  Grid,
  FormControlLabel,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button as ButtonMT,
} from '@material-ui/core';
import Switch, { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch';

import { BsGraphDown, BsGraphUp } from 'react-icons/bs';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FiInfo } from 'react-icons/fi';

import {
  makeStyles,
  useTheme,
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';

import {
  Edit,
  AddCircle,
  ChevronLeft,
  ChevronRight,
  MonetizationOn,
  Delete,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { ImFilter } from 'react-icons/im';

import { MdAttachMoney } from 'react-icons/md';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { HiCurrencyDollar } from 'react-icons/hi';
import { format } from 'date-fns';
import BasePage from '../../components/BasePage';

import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';

import formatValue from '../../utils/formatValue';
import { useToast } from '../../hooks/toast';

import {
  Button as ButtonNew,
  FormContent,
  DateRangePickerContent,
  Label,
  SelectContainer,
  CardTotals,
} from './styles';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface FinancialPosting {
  id?: string;
  obreiro?: {
    id: string;
    name: string;
  };
  costCenter: {
    id: string;
    description: string;
  };
  teller: {
    id: string;
    description: string;
  };
  typeFinancialPosting: {
    id: string;
    description: string;
  };
  date: string;
  mov: string;
  value: number;
  value_formatted?: string;
  due_date?: string;
  payday?: string;
}

interface CheckboxOption {
  id: string;
  value: string;
  label: string;
}

interface OptionsData {
  id: string;
  description: string;
  type: string;
  value: string;
  label: string;
}

interface Obreiro {
  id: string;
  name: string;
  value: string;
  label: string;
}

interface Option {
  id: string;
  value: string;
}

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

interface Payment {
  value: number;
  payment_amount?: number;
  obs_payment?: string;
}

interface QueryParams {
  start_date?: string;
  end_date?: string;
  start_due_date?: string;
  end_due_date?: string;
  type_financial_posting_id?: string;
  cost_center_id?: string;
  only_pays?: boolean;
  obreiro_id?: string;
  mov?: string;
}

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  modalTitle: {
    background: '#0f5e9e',
    color: '#FFF',
    flex: '0 0 auto',
    margin: 0,
    padding: '9px 24px',
    textAlign: 'center',
  },
  modalContent: {
    margin: '15px 0',
    fontWeight: 'bold',
  },
  iconDialog: {
    marginRight: 8,
  },
}));

const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const FinancialPostings: React.FC = () => {
  const dateAux = new Date();
  const [data, setData] = useState<FinancialPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [startDate, setStartDate] = useState(
    new Date(dateAux.getFullYear(), dateAux.getMonth(), 1),
  );
  const [endDate, setEndDate] = useState(
    new Date(dateAux.getFullYear(), dateAux.getMonth() + 1, 0),
  );
  const [startDueDate, setStartDueDate] = useState<Date | null>(null);
  const [endDueDate, setEndDueDate] = useState<Date | null>(null);
  const [typesFinancialPostings, setTypesFinancialPostings] = useState<
    OptionsData[]
  >([]);
  const [costCenters, setCostCenters] = useState<OptionsData[]>([]);
  // const [tellers, setTellers] = useState<OptionsData[]>([]);
  const [obreiros, setObreiros] = useState<Obreiro[]>([]);
  const [onlyPays, setOnlyPays] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedObreiro, setSelectedObreiro] = useState<Option>();
  // const [selectedTeller, setSelectedTeller] = useState<Option>();
  const [
    selectedTypeFinancialPosting,
    setSelectedTypeFinancialPosting,
  ] = useState<Option>();
  const [selectedCostCenter, setSelectedCostCenter] = useState<Option>();
  const [selectedMov, setSelectedMov] = useState<Option>();
  const movs = [
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
  ];
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState('');
  const { addToast } = useToast();
  const [openDialogPayment, setOpenDialogPayment] = useState(false);
  const [toPay, setToPay] = useState<FinancialPosting>();
  const [valuesPayment, setValuesPayment] = useState<Payment>();
  const formRef = useRef<FormHandles>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleCloseDialogDelete = useCallback((): void => {
    setOpenDialogDelete(false);
  }, []);

  const handleCloseDialogPayment = useCallback((): void => {
    setOpenDialogPayment(false);
  }, []);

  const handleDeleteFinancialPosting = useCallback(async () => {
    setOpenDialogDelete(false);
    setLoading(true);
    const res = await api.delete(`/financial-postings/${idToBeDeleted}`);

    if (res.status === 204) {
      const financialPostingsUpdated = data.filter(
        financialPosting => financialPosting.id !== idToBeDeleted,
      );

      setData(financialPostingsUpdated);
      setLoading(false);
      setIdToBeDeleted('');
      addToast({
        type: 'success',
        title: 'Lançamento excluído com sucesso',
      });
    } else {
      setLoading(false);
      addToast({
        type: 'error',
        title: 'Falha ao excluir lançamento, tente novamente.',
      });
    }
  }, [idToBeDeleted, addToast, data]);

  const handleChangeOnlyPays = useCallback(() => {
    setOnlyPays(!onlyPays);
  }, [onlyPays]);

  const handleSubmit = useCallback(async () => {
    const params: QueryParams = {};

    if (startDate && endDate) {
      params.start_date = format(startDate, 'yyyy-MM-dd');
      params.end_date = format(endDate, 'yyyy-MM-dd');
    }

    if (selectedTypeFinancialPosting) {
      params.type_financial_posting_id = selectedTypeFinancialPosting.id;
    }

    if (selectedObreiro) {
      params.obreiro_id = selectedObreiro.id;
    }

    if (selectedCostCenter) {
      params.cost_center_id = selectedCostCenter.id;
    }

    if (selectedMov) {
      params.mov = selectedMov.value;
    }

    if (endDueDate && startDueDate) {
      params.end_due_date = format(endDueDate, 'yyyy-MM-dd');
      params.start_due_date = format(startDueDate, 'yyyy-MM-dd');
    }

    if (onlyPays) {
      params.only_pays = onlyPays;
    }

    setSearchLoading(true);
    api
      .get<FinancialPosting[]>('/financial-postings', {
        params,
      })
      .then(response => {
        setData(
          response.data.map(result => {
            return {
              value_formatted: formatValue(result.value),
              ...result,
            };
          }),
        );
      })
      .finally(() => {
        setSearchLoading(false);
        setOpen(false);
      });
  }, [
    startDate,
    endDate,
    startDueDate,
    endDueDate,
    onlyPays,
    selectedObreiro,
    selectedTypeFinancialPosting,
    selectedCostCenter,
    selectedMov,
  ]);

  const handleChangeStartDate = useCallback((date: Date) => {
    if (date) {
      setStartDate(date);
    }
  }, []);

  const handleChangeEndDate = useCallback((date: Date) => {
    if (date) {
      setEndDate(date);
    }
  }, []);

  const handleChangeStartDueDate = useCallback((date: Date) => {
    if (date) {
      setStartDueDate(date);
    } else {
      setStartDueDate(null);
    }
  }, []);

  const handleChangeEndDueDate = useCallback((date: Date) => {
    if (date) {
      setEndDueDate(date);
    } else {
      setEndDueDate(null);
    }
  }, []);

  useEffect(() => {
    api.get('/types-financial-postings').then(response => {
      setTypesFinancialPostings(
        response.data.map((option: OptionsData) => {
          return {
            ...option,
            label: option.description,
            value: option.id,
          };
        }),
      );
    });
  }, []);

  const deleteFinancialPosting = useCallback((rowData: any): void => {
    setIdToBeDeleted(rowData.id);
    setOpenDialogDelete(true);
  }, []);

  const paymentFinancialPosting = useCallback(
    (rowData: any): void => {
      if (rowData.payday) {
        addToast({ type: 'info', title: 'Baixa já realizada!' });
        return;
      }
      setToPay(rowData);
      setOpenDialogPayment(true);
      setValuesPayment({ value: rowData.value });
    },
    [addToast],
  );

  const handleSubmitPayment = useCallback(
    async dataForm => {
      setPaymentLoading(true);
      api
        .patch('/financial-postings', {
          id: toPay?.id,
          payment_amount: dataForm.payment_amount,
          obs_payment: dataForm.obs_payment,
        })
        .then(res => {
          handleSubmit();
        })
        .finally(() => {
          setPaymentLoading(false);
          setOpenDialogPayment(false);
        });
    },
    [toPay, handleSubmit],
  );

  // useEffect(() => {
  //   setSelectedTeller(undefined);
  //   api.get(`/tellers/cost-center/${selectedCostCenter?.id}`).then(response => {
  //     setTellers(
  //       response.data.map((option: OptionsData) => {
  //         return {
  //           ...option,
  //           label: option.description,
  //           value: option.id,
  //         };
  //       }),
  //     );
  //   });
  // }, [selectedCostCenter]);

  useEffect(() => {
    api.get('/cost-centers').then(response => {
      setCostCenters(
        response.data.map((option: OptionsData) => {
          return {
            ...option,
            label: option.description,
            value: option.id,
          };
        }),
      );
    });
  }, []);

  useEffect(() => {
    api.get('/users/actives').then(response => {
      setObreiros(
        response.data.map((option: Obreiro) => {
          return {
            ...option,
            label: option.name,
            value: option.id,
          };
        }),
      );
    });
  }, []);

  const toggleDrawer = useCallback(
    (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(isOpen);
    },
    [],
  );

  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, []);

  const loadFinancialPostings = useCallback(() => {
    setLoading(true);
    const today = new Date();
    api
      .get<FinancialPosting[]>('/financial-postings', {
        params: {
          start_date: format(
            new Date(today.getFullYear(), today.getMonth(), 1),
            'yyyy-MM-dd',
          ),
          end_date: format(
            new Date(today.getFullYear(), today.getMonth() + 1, 0),
            'yyyy-MM-dd',
          ),
        },
      })
      .then(response => {
        setData(
          response.data.map(result => {
            return {
              value_formatted: formatValue(result.value),
              ...result,
            };
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadFinancialPostings();
  }, [loadFinancialPostings]);

  const dataTable = useMemo(() => {
    return data.filter(el => {
      if (el.obreiro) {
        if (el.mov === 'D') {
          return el;
        }
        return null;
      }
      return el;
    });
  }, [data]);

  const handleAddFinancialPosting = useCallback(() => {
    history.push('lancamento');
  }, [history]);

  const editFinancialPosting = useCallback(
    rowData => {
      history.push(`lancamento/${rowData.id}`);
    },
    [history],
  );

  const debit = useMemo(() => {
    return data.reduce((acc, posting) => {
      if (posting.mov === 'D') {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [data]);

  const credit = useMemo(() => {
    return data.reduce((acc, posting) => {
      if (
        posting.mov === 'C' &&
        posting.typeFinancialPosting.description !== 'Mensalidade'
      ) {
        return acc + posting.value;
      }

      return acc;
    }, 0);
  }, [data]);

  const total = useMemo(() => {
    return debit - credit;
  }, [debit, credit]);

  return (
    <BasePage title="Lançamentos">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <Grid container spacing={2} style={{ paddingTop: 16 }}>
              <Grid item xs={12} md={4}>
                <CardTotals color="#FFF" colorIcon="#12a454">
                  <div className="icon">
                    <BsGraphUp />
                  </div>
                  <div className="content">
                    <div className="header">Débitos</div>
                    <div className="total">{formatValue(debit)}</div>
                  </div>
                </CardTotals>
              </Grid>
              <Grid item xs={12} md={4}>
                <CardTotals color="#FFF" colorIcon="#c53030">
                  <div className="icon">
                    <BsGraphDown />
                  </div>
                  <div className="content">
                    <div className="header">Créditos</div>
                    <div className="total">{formatValue(credit)}</div>
                  </div>
                </CardTotals>
              </Grid>
              <Grid item xs={12} md={4}>
                <CardTotals
                  color={total > 0 ? '#12a454' : '#c53030'}
                  fontColor="#FFF"
                >
                  <div className="icon">
                    <MdAttachMoney />
                  </div>
                  <div className="content">
                    <div className="header">Total</div>
                    <div className="total">{formatValue(total)}</div>
                  </div>
                </CardTotals>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Grid item xs={12} md={4} style={{ display: 'flex' }}>
                <ButtonNew type="button" onClick={handleDrawerOpen}>
                  Filtrar
                  <ImFilter style={{ color: '#0f5e9e' }} />
                </ButtonNew>
              </Grid>
              <Grid item xs={12} md={4} style={{ display: 'flex' }}>
                <ButtonNew type="button" onClick={handleAddFinancialPosting}>
                  Adicionar Lançamento Finan.
                  <AddCircle style={{ color: '#0f5e9e' }} />
                </ButtonNew>
              </Grid>
            </Grid>

            <MaterialTable
              title="Listagem Lançamentos Finan."
              localization={labels.materialTable.localization}
              columns={[
                { title: 'Pago', field: 'payday', type: 'boolean' },
                { title: 'Data', field: 'date', type: 'date' },
                { title: 'Tipo', field: 'typeFinancialPosting.description' },
                { title: 'Valor', field: 'value_formatted' },
                { title: 'C.C.', field: 'costCenter.description' },
                { title: 'Caixa', field: 'teller.description' },
                { title: 'Mov.', field: 'mov' },
                { title: 'Obreiro', field: 'obreiro.name' },
                { title: 'Data Venc.', field: 'due_date', type: 'date' },
              ]}
              data={[...dataTable]}
              style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
              options={{
                pageSize: 10,
                headerStyle: {
                  zIndex: 0,
                },
              }}
              actions={[
                rowData => ({
                  icon: () => <Edit style={{ color: '#1976d2' }} />,
                  onClick: () => editFinancialPosting(rowData),
                  tooltip: 'Editar',
                }),
                rowData => ({
                  icon: () => <MonetizationOn style={{ color: '#12a454' }} />,
                  onClick: () => paymentFinancialPosting(rowData),
                  tooltip: 'Baixar',
                }),
                rowData => ({
                  icon: () => <Delete style={{ color: '#c53030' }} />,
                  onClick: () => deleteFinancialPosting(rowData),
                  tooltip: 'Excluir',
                }),
              ]}
            />
          </Container>

          <SwipeableDrawer
            className={classes.drawer}
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose} type="button">
                {theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
              <Button
                type="submit"
                style={{ marginTop: 0 }}
                onClick={handleSubmit}
              >
                {searchLoading ? (
                  <CircularProgress style={{ color: '#FFF' }} />
                ) : (
                  'CONFIRMAR'
                )}
              </Button>
            </div>
            <Divider />

            <FormContent>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  style={{
                    backgroundColor: '#6b9ec7',
                    borderRadius: 10,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  <FormControlLabel
                    control={
                      // eslint-disable-next-line react/jsx-wrap-multilines
                      <IOSSwitch
                        checked={onlyPays}
                        onChange={handleChangeOnlyPays}
                        name="checkedB"
                      />
                    }
                    label="Somente Pagos"
                  />
                </Grid>
                <Grid item xs={12}>
                  <DateRangePickerContent>
                    <Label>Data</Label>
                    <DatePicker
                      name="initial_date"
                      selected={startDate}
                      onChange={handleChangeStartDate}
                      placeholderText="Selecione a data"
                      startDate={startDate}
                      dateFormat="dd/MM/yyyy"
                      locale="pt-BR"
                      selectsStart
                    />
                    <DatePicker
                      name="final_date"
                      selected={endDate}
                      placeholderText="Selecione a data"
                      onChange={handleChangeEndDate}
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      dateFormat="dd/MM/yyyy"
                      locale="pt-BR"
                      selectsEnd
                    />
                  </DateRangePickerContent>
                </Grid>

                <Grid item xs={12}>
                  <div>
                    <Label>Tipo de lançamento</Label>
                    <SelectContainer
                      name="type_financial_posting_id"
                      classNamePrefix="react-select"
                      defaultValue={selectedTypeFinancialPosting}
                      onChange={setSelectedTypeFinancialPosting}
                      placeholder="Selecione..."
                      options={typesFinancialPostings}
                      isClearable
                      isSearchable={false}
                    />
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div>
                    <Label>Centro de Custo</Label>
                    <SelectContainer
                      name="cost_center_id"
                      label="Centro de Custo"
                      placeholder="Selecione..."
                      defaultValue={selectedCostCenter}
                      onChange={setSelectedCostCenter}
                      options={costCenters}
                      classNamePrefix="react-select"
                      isClearable
                      isSearchable={false}
                    />
                  </div>
                </Grid>

                {/* <Grid item xs={12}>
                  <div>
                    <Label>Caixa</Label>
                    <SelectContainer
                      name="teller_id"
                      placeholder="Selecione..."
                      defaultValue={selectedTeller}
                      onChange={setSelectedTeller}
                      options={tellers}
                      classNamePrefix="react-select"
                      isClearable
                    />
                  </div>
                </Grid> */}

                <Grid item xs={12}>
                  <div>
                    <Label>Mov.</Label>
                    <SelectContainer
                      name="mov"
                      placeholder="Selecione..."
                      onChange={setSelectedMov}
                      defaultValue={selectedMov}
                      options={movs}
                      classNamePrefix="react-select"
                      isClearable
                      isSearchable={false}
                    />
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div>
                    <Label>Obreiro</Label>
                    <SelectContainer
                      name="obreiro_id"
                      label="Obreiro"
                      placeholder="Selecione..."
                      onChange={setSelectedObreiro}
                      defaultValue={selectedObreiro}
                      options={obreiros}
                      classNamePrefix="react-select"
                      isClearable
                    />
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <DateRangePickerContent>
                    <Label>Data de Vencimento</Label>
                    <DatePicker
                      name="initial_due_date"
                      selected={startDueDate}
                      onChange={handleChangeStartDueDate}
                      placeholderText="Selecione a data"
                      startDate={startDueDate}
                      dateFormat="dd/MM/yyyy"
                      locale="pt-BR"
                      selectsStart
                    />
                    <DatePicker
                      name="final_due_date"
                      selected={endDueDate}
                      placeholderText="Selecione a data"
                      onChange={handleChangeEndDueDate}
                      startDate={startDueDate}
                      endDate={endDueDate}
                      minDate={startDueDate}
                      dateFormat="dd/MM/yyyy"
                      locale="pt-BR"
                      selectsEnd
                    />
                  </DateRangePickerContent>
                </Grid>
              </Grid>
            </FormContent>
          </SwipeableDrawer>

          {/* Dialog delete Financial Posting */}
          <Dialog
            open={openDialogDelete}
            onClose={handleCloseDialogDelete}
            aria-labelledby="dialog-delete"
            aria-describedby="dialog-delete-description"
          >
            <DialogTitle
              className={classes.modalTitle}
              id="dialog-delete-title"
            >
              <FaExclamationTriangle className={classes.iconDialog} />
              Atenção
            </DialogTitle>
            <Divider />
            <DialogContent>
              <DialogContentText
                className={classes.modalContent}
                id="dialog-delete-description"
              >
                Deseja realmente excluir o lançamento?
              </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
              <ButtonMT
                onClick={handleCloseDialogDelete}
                className="buttonCancel"
              >
                Cancelar
              </ButtonMT>
              <ButtonMT
                className="buttonConfirm"
                onClick={handleDeleteFinancialPosting}
                autoFocus
              >
                Confirmar
              </ButtonMT>
            </DialogActions>
          </Dialog>
          {/* Dialog delete Financial Posting */}

          {/* Dialog payment Financial Posting */}
          <Dialog
            open={openDialogPayment}
            onClose={handleCloseDialogDelete}
            aria-labelledby="dialog-payment"
            aria-describedby="dialog-payment-description"
          >
            <Form
              ref={formRef}
              initialData={valuesPayment}
              onSubmit={handleSubmitPayment}
            >
              <DialogTitle
                className={classes.modalTitle}
                id="dialog-payment-title"
              >
                <FaExclamationTriangle className={classes.iconDialog} />
                Baixa de Lançamento
              </DialogTitle>
              <Divider />
              <DialogContent>
                <Input
                  label="Valor"
                  type="number"
                  name="value"
                  icon={HiCurrencyDollar}
                  placeholder="Digite o valor"
                  step={0.01}
                  readOnly
                />
                <Input
                  label="Valor Pago"
                  type="number"
                  name="payment_amount"
                  icon={HiCurrencyDollar}
                  placeholder="Digite o valor"
                  step={0.01}
                />
                <Input
                  name="obs_payment"
                  label="Observação de Pagamento"
                  placeholder="Digite a observação de pagamento"
                  icon={FiInfo}
                />
              </DialogContent>
              <Divider />
              <DialogActions>
                <ButtonMT
                  onClick={handleCloseDialogPayment}
                  className="buttonCancel"
                >
                  Cancelar
                </ButtonMT>
                <ButtonMT className="buttonConfirm" type="submit" autoFocus>
                  {paymentLoading ? (
                    <CircularProgress style={{ color: '#FFF' }} />
                  ) : (
                    'Confirmar'
                  )}
                </ButtonMT>
              </DialogActions>
            </Form>
          </Dialog>
          {/* Dialog payment Financial Posting */}
        </>
      )}
    </BasePage>
  );
};

export default FinancialPostings;

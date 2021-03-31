import React, { useCallback, useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import MaterialTable from 'material-table';
import {
  Container,
  SwipeableDrawer,
  Divider,
  IconButton,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button as ButtonMT,
} from '@material-ui/core';

import { BsGraphDown, BsGraphUp } from 'react-icons/bs';
import { FaExclamationTriangle } from 'react-icons/fa';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import {
  Edit,
  AddCircle,
  ChevronLeft,
  ChevronRight,
  Delete,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { ImFilter } from 'react-icons/im';

import { MdAttachMoney } from 'react-icons/md';

import { format } from 'date-fns';
import BasePage from '../../components/BasePage';

import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';

import formatValue from '../../utils/formatValue';
import { useToast } from '../../hooks/toast';
import { useDonationsFilters } from '../../hooks/donationsFilters';

import {
  Button as ButtonNew,
  FormContent,
  DateRangePickerContent,
  Label,
  CardTotals,
} from './styles';
import Button from '../../components/Button';

interface Donation {
  id?: string;
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
}

interface QueryParams {
  start_date?: string;
  end_date?: string;
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

const Donations: React.FC = () => {
  const { startDate, setSDate, endDate, setEDate } = useDonationsFilters();
  const [data, setData] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [searchLoading, setSearchLoading] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState('');
  const { addToast } = useToast();

  const handleCloseDialogDelete = useCallback((): void => {
    setOpenDialogDelete(false);
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

  const handleSubmit = useCallback(async () => {
    const params: QueryParams = {};

    if (startDate && endDate) {
      params.start_date = format(startDate, 'yyyy-MM-dd');
      params.end_date = format(endDate, 'yyyy-MM-dd');
    }

    setSearchLoading(true);
    api
      .get<Donation[]>('/donations', {
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
  }, [startDate, endDate]);

  const handleChangeStartDate = useCallback(
    (date: Date) => {
      if (date) {
        setSDate(date);
      }
    },
    [setSDate],
  );

  const handleChangeEndDate = useCallback(
    (date: Date) => {
      if (date) {
        setEDate(date);
      }
    },
    [setEDate],
  );

  const deleteFinancialPosting = useCallback((rowData: any): void => {
    setIdToBeDeleted(rowData.id);
    setOpenDialogDelete(true);
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
    const params: QueryParams = {};

    if (startDate && endDate) {
      params.start_date = format(startDate, 'yyyy-MM-dd');
      params.end_date = format(endDate, 'yyyy-MM-dd');
    }
    api
      .get<Donation[]>('/donations', {
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
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadFinancialPostings();
  }, [loadFinancialPostings]);

  const handleAddFinancialPosting = useCallback(() => {
    history.push('doacao');
  }, [history]);

  const editFinancialPosting = useCallback(
    rowData => {
      history.push(`doacao/${rowData.id}`);
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
    <BasePage title="Beneficências">
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
                  Adicionar Beneficência
                  <AddCircle style={{ color: '#0f5e9e' }} />
                </ButtonNew>
              </Grid>
            </Grid>

            <MaterialTable
              title="Listagem Beneficências"
              localization={labels.materialTable.localization}
              columns={[
                { title: 'Data', field: 'date', type: 'date' },
                { title: 'Tipo', field: 'typeFinancialPosting.description' },
                { title: 'Valor', field: 'value_formatted' },
                { title: 'C.C.', field: 'costCenter.description' },
                { title: 'Caixa', field: 'teller.description' },
                { title: 'Mov.', field: 'mov' },
              ]}
              data={[...data]}
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
                <Grid item xs={12}>
                  <DateRangePickerContent>
                    <Label>Data</Label>
                    <DatePicker
                      selected={startDate}
                      onChange={handleChangeStartDate}
                      placeholderText="Selecione a data"
                      startDate={startDate}
                      dateFormat="dd/MM/yyyy"
                      locale="pt-BR"
                      selectsStart
                    />
                    <DatePicker
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
                Deseja realmente excluir a beneficência?
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
        </>
      )}
    </BasePage>
  );
};

export default Donations;

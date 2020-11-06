import React, { useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import MaterialTable from 'material-table';
import {
  Container,
  SwipeableDrawer,
  Divider,
  IconButton,
  Grid,
} from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import { Edit, AddCircle, ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { ImFilter } from 'react-icons/im';

import BasePage from '../../components/BasePage';

import labels from '../../utils/labels';
import api from '../../services/api';
import Loading from '../../components/Loading';

import formatValue from '../../utils/formatValue';

import { Button } from './styles';

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
  typeFinancialPosting: {
    id: string;
    description: string;
  };
  date: string;
  value: number;
  value_formatted?: string;
  due_date?: string;
  payday?: string;
}
const drawerWidth = 240;

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
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
}));

const FinancialPostings: React.FC = () => {
  const [data, setData] = useState<FinancialPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

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
    api
      .get<FinancialPosting[]>('/financial-postings')
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

  const handleAddFinancialPosting = useCallback(() => {
    history.push('lancamento');
  }, [history]);

  const editFinancialPosting = useCallback(
    rowData => {
      history.push(`lancamento/${rowData.id}`);
    },
    [history],
  );

  return (
    <BasePage title="Tipos de Lançamentos Finan.">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <Grid
              container
              spacing={2}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Grid item xs={12} md={4} style={{ display: 'flex' }}>
                <Button
                  type="button"
                  onClick={handleDrawerOpen}
                  className={clsx(open && classes.hide)}
                >
                  Filtrar
                  <ImFilter style={{ color: '#0f5e9e' }} />
                </Button>
              </Grid>
              <Grid item xs={12} md={4} style={{ display: 'flex' }}>
                <Button type="button" onClick={handleAddFinancialPosting}>
                  Adicionar Lançamento Finan.
                  <AddCircle style={{ color: '#0f5e9e' }} />
                </Button>
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
                { title: 'Mov.', field: 'mov' },
                { title: 'Obreiro', field: 'obreiro.name' },
                { title: 'Data Venc.', field: 'due_date', type: 'date' },
              ]}
              data={[...data]}
              style={{ marginTop: 16, border: '2px solid #0f5e9e' }}
              actions={[
                rowData => ({
                  icon: () => <Edit style={{ color: '#1976d2' }} />,
                  onClick: () => editFinancialPosting(rowData),
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
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </div>
            <Divider />
          </SwipeableDrawer>
        </>
      )}
    </BasePage>
  );
};

export default FinancialPostings;

import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import {
  IconButton,
  SwipeableDrawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Divider,
} from '@material-ui/core';
import { FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';

import { useHistory } from 'react-router-dom';
import { AccountCircle } from '@material-ui/icons';
import logoMaconaria from '../../assets/esquadro_compasso.png';

import { useAuth } from '../../hooks/auth';

import { ContainerImg, Username } from './styles';

import ListItemLink from '../ListItemLink';
import Menu from '../Menu';
import MenuGeneral from '../MenuGeneral';

interface ViewProps {
  title: string;
  backLink?: string;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      background: '#0f5e9e ',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    signOutButton: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
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
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      maxWidth: '100%',
      padding: theme.spacing(0),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      paddingBottom: 50,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
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
    modalActions: {
      background: '#0f5e9e',
    },
    nested: {
      paddingLeft: theme.spacing(4),
      borderBottom: '1px solid #e0e0e0',
    },
    nestedThird: {
      paddingLeft: theme.spacing(6),
      borderBottom: '1px solid #e0e0e0',
    },
    collapseSecondLevel: {
      paddingLeft: 32,
    },
  }),
);

const BasePage: React.FC<ViewProps> = ({ children, title, backLink }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const history = useHistory();
  const { signOut, user } = useAuth();

  const handleDrawerOpen = (): void => {
    setOpen(true);
  };

  const handleDrawerClose = (): void => {
    setOpen(false);
  };

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

  const handleGoBack = useCallback(() => {
    history.push(backLink || '/');
  }, [history, backLink]);

  const handleClickOpen = (): void => {
    setOpenDialog(true);
  };

  const handleClose = (): void => {
    setOpenDialog(false);
  };

  const handleSignOut = useCallback(() => {
    signOut();

    history.push('/');
  }, [signOut, history]);

  const handleGoToProfile = useCallback(() => {
    history.push('/app/profile');
  }, [history]);

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            {backLink && (
              <IconButton
                color="inherit"
                aria-label="Voltar"
                onClick={handleGoBack}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <BackIcon fontSize="large" />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
            <div className={classes.signOutButton}>
              <IconButton
                color="inherit"
                aria-label="logout"
                aria-controls="menu-appbar"
                onClick={handleGoToProfile}
              >
                <AccountCircle />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="logout"
                aria-controls="menu-appbar"
                onClick={handleClickOpen}
              >
                <FaSignOutAlt />
              </IconButton>
              <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle
                  className={classes.modalTitle}
                  id="alert-dialog-title"
                >
                  <FaExclamationTriangle className={classes.iconDialog} />
                  Atenção
                </DialogTitle>
                <Divider />
                <DialogContent>
                  <DialogContentText
                    className={classes.modalContent}
                    id="alert-dialog-description"
                  >
                    Deseja realmente sair?
                  </DialogContentText>
                </DialogContent>
                <Divider />
                <DialogActions>
                  <Button onClick={handleClose} className="buttonCancel">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    className="buttonConfirm"
                    autoFocus
                  >
                    Confirmar
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          className={classes.drawer}
          // variant="persistent"
          anchor="left"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <ContainerImg>
              <img src={logoMaconaria} alt="Maçonaria Logo" />
            </ContainerImg>
            <Username>{user.name.split(' ')[0]}</Username>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItemLink
              icon={<DashboardIcon />}
              to="/app/dashboard"
              primary="Dashboard"
            />
            <Menu administrativeFunction={user.administrative_function} />
            <Divider />
            <MenuGeneral />
          </List>
        </SwipeableDrawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          {children}
        </main>
      </div>
    </>
  );
};

export default BasePage;

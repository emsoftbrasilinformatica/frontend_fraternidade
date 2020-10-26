import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from '@material-ui/core';
import {
  SupervisedUserCircle,
  Lock,
  AccountTree,
  ExpandLess,
  ExpandMore,
  Assignment,
  Publish,
  ChromeReaderMode,
} from '@material-ui/icons';
import { FaNewspaper, FaCalendar, FaFileContract } from 'react-icons/fa';
import { MdGroupWork } from 'react-icons/md';
import { FiType } from 'react-icons/fi';
import ListItemLink from '../ListItemLink';

interface MenuProps {
  administrativeFunction?: {
    description: string;
    admin: boolean;
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const Menu: React.FC<MenuProps> = ({ administrativeFunction, ...rest }) => {
  const classes = useStyles();
  const [openCollapseCadastros, setOpenCollapseCadastros] = React.useState(
    false,
  );
  const [openCollapseSessoes, setOpenCollapseSessoes] = React.useState(false);

  const handleOpenCollapseCadastrosClick = (): void => {
    setOpenCollapseCadastros(!openCollapseCadastros);
  };

  const handleOpenCollapseSessoesClick = (): void => {
    setOpenCollapseSessoes(!openCollapseSessoes);
  };

  if (administrativeFunction?.description === 'Venerável') {
    return (
      <>
        <ListItem button onClick={handleOpenCollapseCadastrosClick}>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Cadastros" />
          {openCollapseCadastros ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse
          in={openCollapseCadastros}
          timeout="auto"
          unmountOnExit
          style={{ borderTop: '1px solid #e0e0e0' }}
        >
          <List component="div" disablePadding>
            <ListItemLink
              className={classes.nested}
              icon={<SupervisedUserCircle />}
              to="/app/cad/usuarios"
              primary="Usuários"
            />
            <ListItemLink
              className={classes.nested}
              icon={<Lock />}
              to="/app/cad/palavra-semestral"
              primary="Palavra Semestral"
            />
            <ListItemLink
              className={classes.nested}
              icon={<AccountTree />}
              to="/app/cad/gestoes"
              primary="Gestões"
            />
            <ListItemLink
              className={classes.nested}
              icon={<FaNewspaper style={{ fontSize: '1.5rem' }} />}
              to="/app/cad/noticias"
              primary="Notícias"
            />
            <ListItemLink
              className={classes.nested}
              icon={<FaFileContract style={{ fontSize: '1.5rem' }} />}
              to="/app/cad/estatutos"
              primary="Estatutos"
            />
            <ListItem
              button
              className={classes.collapseSecondLevel}
              onClick={handleOpenCollapseSessoesClick}
            >
              <ListItemIcon>
                <MdGroupWork style={{ fontSize: '1.5rem' }} />
              </ListItemIcon>
              <ListItemText primary="Sessões" />
              {openCollapseSessoes ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openCollapseSessoes}
              timeout="auto"
              unmountOnExit
              style={{ borderTop: '1px solid #e0e0e0' }}
            >
              <List component="div" disablePadding>
                <ListItemLink
                  className={classes.nestedThird}
                  icon={<FaCalendar style={{ fontSize: '1.5rem' }} />}
                  to="/app/cad/sessoes"
                  primary="Agendamento"
                />
                <ListItemLink
                  className={classes.nestedThird}
                  icon={<FiType style={{ fontSize: '1.5rem' }} />}
                  to="/app/cad/tipos-sessao"
                  primary="Tipos de Sessões"
                />
              </List>
            </Collapse>
          </List>
        </Collapse>

        <ListItemLink
          icon={<ChromeReaderMode />}
          to="/app/dashboard"
          primary="Atas de Sessões"
        />

        <ListItemLink
          icon={<Publish />}
          to="/app/dashboard"
          primary="Uploads"
        />
      </>
    );
  }

  if (administrativeFunction?.description === 'Secretário') {
    return (
      <>
        <ListItemLink
          icon={<ChromeReaderMode />}
          to="/app/dashboard"
          primary="Atas de Sessões"
        />
        <ListItemLink
          icon={<Publish />}
          to="/app/dashboard"
          primary="Uploads"
        />
      </>
    );
  }
  if (administrativeFunction && administrativeFunction.admin) {
    return (
      <ListItemLink icon={<Publish />} to="/app/dashboard" primary="Uploads" />
    );
  }

  return null;
};

export default Menu;

import React, { ReactElement, Fragment } from 'react';
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
  CreditCard,
  MonetizationOn,
  AccountBalance,
  AccountBalanceWallet,
  AttachMoney,
  MoneyOff,
} from '@material-ui/icons';
import { FaNewspaper, FaCalendar, FaFileContract } from 'react-icons/fa';
import { MdGroupWork } from 'react-icons/md';
import { VscLibrary } from 'react-icons/vsc';
import { FiType } from 'react-icons/fi';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { BiDonateHeart } from 'react-icons/bi';
import { GiMoneyStack, GiThreeFriends } from 'react-icons/gi';
import ListItemLink from '../ListItemLink';

interface MenuProps {
  administrativeFunction?: {
    description: string;
    admin: boolean;
  };
}

interface ItemMenu {
  description: string;
  link: string;
  icon: ReactElement;
  collapse: boolean;
  onClick?: VoidFunction;
  controller?: boolean;
  collapseItem?: ReactElement;
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
  const [openCollapseFinanceiro, setOpenCollapseFinanceiro] = React.useState(
    false,
  );

  const handleOpenCollapseCadastrosClick = (): void => {
    setOpenCollapseCadastros(!openCollapseCadastros);
    if (openCollapseFinanceiro) {
      setOpenCollapseFinanceiro(!openCollapseFinanceiro);
    }
  };

  const handleOpenCollapseSessoesClick = (): void => {
    setOpenCollapseSessoes(!openCollapseSessoes);
  };

  const handleOpenCollapseFinanceiroClick = (): void => {
    setOpenCollapseFinanceiro(!openCollapseFinanceiro);
    if (openCollapseCadastros) {
      setOpenCollapseCadastros(!openCollapseCadastros);
    }
  };

  const itemsCadastros: ItemMenu[] = [
    {
      description: 'Obreiros',
      link: '/app/cad/obreiros',
      icon: <SupervisedUserCircle />,
      collapse: false,
    },
    {
      icon: <Lock />,
      link: '/app/cad/palavra-semestral',
      description: 'Palavra Semestral',
      collapse: false,
    },
    {
      icon: <AccountTree />,
      link: '/app/cad/gestoes',
      description: 'Gestões',
      collapse: false,
    },
    {
      icon: <FaNewspaper style={{ fontSize: '1.5rem' }} />,
      link: '/app/cad/noticias',
      description: 'Notícias',
      collapse: false,
    },
    {
      icon: <FaFileContract style={{ fontSize: '1.5rem' }} />,
      link: '/app/cad/estatutos',
      description: 'Estatutos',
      collapse: false,
    },
    {
      icon: <VscLibrary style={{ fontSize: '1.5rem' }} />,
      link: '/app/cad/bibliotecas',
      description: 'Biblioteca',
      collapse: false,
    },
    {
      icon: <MdGroupWork style={{ fontSize: '1.5rem' }} />,
      description: 'Sessões',
      link: '',
      collapse: true,
      onClick: handleOpenCollapseSessoesClick,
      controller: openCollapseSessoes,
      collapseItem: (
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
              icon={<AiOutlineAreaChart style={{ fontSize: '1.5rem' }} />}
              to="/app/cad/frequencias"
              primary="Frequências"
            />
            <ListItemLink
              className={classes.nestedThird}
              icon={<FiType style={{ fontSize: '1.5rem' }} />}
              to="/app/cad/tipos-sessao"
              primary="Tipos de Sessões"
            />
            <ListItemLink
              className={classes.nestedThird}
              icon={<GiThreeFriends style={{ fontSize: '1.5rem' }} />}
              to="/app/cad/visitas"
              primary="Visitas"
            />
          </List>
        </Collapse>
      ),
    },
  ];

  const itemsCadastrosChanceler: ItemMenu[] = [
    {
      description: 'Obreiros',
      link: '/app/cad/obreiros',
      icon: <SupervisedUserCircle />,
      collapse: false,
    },
    {
      icon: <MdGroupWork style={{ fontSize: '1.5rem' }} />,
      description: 'Sessões',
      link: '',
      collapse: true,
      onClick: handleOpenCollapseSessoesClick,
      controller: openCollapseSessoes,
      collapseItem: (
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
              icon={<AiOutlineAreaChart style={{ fontSize: '1.5rem' }} />}
              to="/app/cad/frequencias"
              primary="Frequências"
            />
            <ListItemLink
              className={classes.nestedThird}
              icon={<FiType style={{ fontSize: '1.5rem' }} />}
              to="/app/cad/tipos-sessao"
              primary="Tipos de Sessões"
            />
            <ListItemLink
              className={classes.nestedThird}
              icon={<GiThreeFriends style={{ fontSize: '1.5rem' }} />}
              to="/app/cad/visitas"
              primary="Visitas"
            />
          </List>
        </Collapse>
      ),
    },
  ];

  const itemsCadastrosSecretario: ItemMenu[] = [
    {
      icon: <FaFileContract style={{ fontSize: '1.5rem' }} />,
      link: '/app/cad/estatutos',
      description: 'Estatutos',
      collapse: false,
    },
    {
      icon: <VscLibrary style={{ fontSize: '1.5rem' }} />,
      link: '/app/cad/bibliotecas',
      description: 'Biblioteca',
      collapse: false,
    },
    {
      icon: <FaNewspaper style={{ fontSize: '1.5rem' }} />,
      link: '/app/cad/noticias',
      description: 'Notícias',
      collapse: false,
    },
  ];

  const itemsFinanceiro: ItemMenu[] = [
    {
      icon: <AccountBalance />,
      link: '/app/financeiro/centros-custo',
      description: 'Centros de Custo',
      collapse: false,
    },
    {
      icon: <GiMoneyStack style={{ fontSize: '1.5rem' }} />,
      link: '/app/financeiro/caixas',
      description: 'Caixas',
      collapse: false,
    },
    {
      icon: <CreditCard />,
      link: '/app/financeiro/tipos-lancamentos',
      description: 'Tipos de Lançamentos',
      collapse: false,
    },
    {
      icon: <AccountBalanceWallet />,
      link: '/app/financeiro/lancamentos',
      description: 'Lançamentos',
      collapse: false,
    },
    {
      icon: <AttachMoney />,
      link: '/app/financeiro/demonstracao',
      description: 'Demonstração',
      collapse: false,
    },
    {
      icon: <AccountBalance />,
      link: '/app/financeiro/contas-bancarias',
      description: 'Contas Bancárias',
      collapse: false,
    },
    {
      icon: <MoneyOff />,
      link: '/app/financeiro/inadimplentes',
      description: 'Inadimplentes',
      collapse: false,
    },
  ];

  const menus = {
    cadastros: (
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
            {itemsCadastros
              .sort((a, b) => {
                if (a.description > b.description) {
                  return 1;
                }
                if (b.description > a.description) {
                  return -1;
                }
                return 0;
              })
              .map(item => {
                if (item.collapse) {
                  return (
                    <Fragment key={item.description}>
                      <ListItem
                        button
                        className={classes.collapseSecondLevel}
                        onClick={item.onClick}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.description} />
                        {item.controller ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      {item.collapseItem}
                    </Fragment>
                  );
                }
                return (
                  <ListItemLink
                    key={item.description}
                    className={classes.nested}
                    icon={item.icon}
                    to={item.link}
                    primary={item.description}
                  />
                );
              })}
          </List>
        </Collapse>
      </>
    ),
    cadastrosChanceler: (
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
            {itemsCadastrosChanceler
              .sort((a, b) => {
                if (a.description > b.description) {
                  return 1;
                }
                if (b.description > a.description) {
                  return -1;
                }
                return 0;
              })
              .map(item => {
                if (item.collapse) {
                  return (
                    <Fragment key={item.description}>
                      <ListItem
                        button
                        className={classes.collapseSecondLevel}
                        onClick={item.onClick}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.description} />
                        {item.controller ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      {item.collapseItem}
                    </Fragment>
                  );
                }
                return (
                  <ListItemLink
                    key={item.description}
                    className={classes.nested}
                    icon={item.icon}
                    to={item.link}
                    primary={item.description}
                  />
                );
              })}
          </List>
        </Collapse>
      </>
    ),
    cadastrosSecretario: (
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
            {itemsCadastrosSecretario
              .sort((a, b) => {
                if (a.description > b.description) {
                  return 1;
                }
                if (b.description > a.description) {
                  return -1;
                }
                return 0;
              })
              .map(item => {
                if (item.collapse) {
                  return (
                    <Fragment key={item.description}>
                      <ListItem
                        button
                        className={classes.collapseSecondLevel}
                        onClick={item.onClick}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.description} />
                        {item.controller ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      {item.collapseItem}
                    </Fragment>
                  );
                }
                return (
                  <ListItemLink
                    key={item.description}
                    className={classes.nested}
                    icon={item.icon}
                    to={item.link}
                    primary={item.description}
                  />
                );
              })}
          </List>
        </Collapse>
      </>
    ),
    financeiro: (
      <>
        <ListItem button onClick={handleOpenCollapseFinanceiroClick}>
          <ListItemIcon>
            <MonetizationOn />
          </ListItemIcon>
          <ListItemText primary="Financeiro" />
          {openCollapseFinanceiro ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse
          in={openCollapseFinanceiro}
          timeout="auto"
          unmountOnExit
          style={{ borderTop: '1px solid #e0e0e0' }}
        >
          <List component="div" disablePadding>
            {itemsFinanceiro
              .sort((a, b) => {
                if (a.description > b.description) {
                  return 1;
                }
                if (b.description > a.description) {
                  return -1;
                }
                return 0;
              })
              .map(item => {
                if (item.collapse) {
                  return (
                    <Fragment key={item.description}>
                      <ListItem
                        button
                        className={classes.collapseSecondLevel}
                        onClick={item.onClick}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.description} />
                        {item.controller ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      {item.collapseItem}
                    </Fragment>
                  );
                }
                return (
                  <ListItemLink
                    key={item.description}
                    className={classes.nested}
                    icon={item.icon}
                    to={item.link}
                    primary={item.description}
                  />
                );
              })}
          </List>
        </Collapse>
      </>
    ),
    atas: (
      <ListItemLink
        icon={<ChromeReaderMode />}
        to="/app/cad/atas-sessao"
        primary="Atas de Sessões"
      />
    ),
    doacao: (
      <ListItemLink
        icon={<BiDonateHeart style={{ fontSize: '1.5rem' }} />}
        to="/app/doacoes"
        primary="Doações"
      />
    ),
    uploads: (
      <ListItemLink
        icon={<Publish />}
        to="/app/cad/uploads"
        primary="Uploads"
      />
    ),
  };

  if (administrativeFunction?.description === 'Venerável') {
    return (
      <>
        {menus.cadastros}
        {menus.financeiro}
        {menus.doacao}
        {menus.atas}
        {menus.uploads}
      </>
    );
  }

  if (administrativeFunction?.description === 'Tesoureiro') {
    return (
      <>
        {menus.financeiro}
        {menus.uploads}
      </>
    );
  }

  if (administrativeFunction?.description === 'Chanceler') {
    return (
      <>
        {menus.cadastrosChanceler}
        {menus.uploads}
      </>
    );
  }

  if (administrativeFunction?.description === 'Secretário') {
    return (
      <>
        {menus.cadastrosSecretario}
        {menus.atas}
        {menus.uploads}
      </>
    );
  }

  if (administrativeFunction?.description === 'Hospitaleiro') {
    return (
      <>
        {menus.doacao}
        {menus.uploads}
      </>
    );
  }

  if (administrativeFunction && administrativeFunction.admin) {
    return <>{menus.uploads}</>;
  }

  return null;
};

export default Menu;

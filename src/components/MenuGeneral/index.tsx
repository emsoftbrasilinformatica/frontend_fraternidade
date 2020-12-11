import React, { ReactElement } from 'react';

import { AccountBalanceWallet } from '@material-ui/icons';

import { GiTakeMyMoney } from 'react-icons/gi';
import { FaCalendarDay, FaFileContract } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { AiOutlineAreaChart } from 'react-icons/ai';
import ListItemLink from '../ListItemLink';

interface ItemMenu {
  description: string;
  link: string;
  icon: ReactElement;
  collapse: boolean;
  onClick?: VoidFunction;
  controller?: boolean;
  collapseItem?: ReactElement;
}

const Menu: React.FC = () => {
  const itemsGeneral: ItemMenu[] = [
    {
      icon: <FaFileContract style={{ fontSize: '1.5rem' }} />,
      link: '/app/geral/estatutos',
      description: 'Estatutos',
      collapse: false,
    },
    {
      icon: <MdWork style={{ fontSize: '1.5rem' }} />,
      link: '/app/geral/trabalhos',
      description: 'Trabalhos',
      collapse: false,
    },
    {
      icon: <FaCalendarDay style={{ fontSize: '1.5rem' }} />,
      link: '/app/geral/agenda-sessoes',
      description: 'Agenda de Sessões',
      collapse: false,
    },
    {
      icon: <AiOutlineAreaChart style={{ fontSize: '1.5rem' }} />,
      link: '/app/dashboard',
      description: 'Frequência',
      collapse: false,
    },
    {
      icon: <GiTakeMyMoney style={{ fontSize: '1.5rem' }} />,
      link: '/app/geral/consulta',
      description: 'Consulta Financeira',
      collapse: false,
    },
  ];

  const menus = {
    general: (
      <>
        {itemsGeneral
          .sort((a, b) => {
            if (a.description > b.description) {
              return 1;
            }
            if (b.description > a.description) {
              return -1;
            }
            return 0;
          })
          .map(item => (
            <ListItemLink
              key={item.link}
              icon={item.icon}
              to={item.link}
              primary={item.description}
            />
          ))}
      </>
    ),
  };

  return <>{menus.general}</>;
};

export default Menu;

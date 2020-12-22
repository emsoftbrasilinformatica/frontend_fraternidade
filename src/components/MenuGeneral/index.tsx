import React, { ReactElement } from 'react';

import { GiTakeMyMoney } from 'react-icons/gi';
import { FaCalendarDay, FaFileContract, FaHistory } from 'react-icons/fa';
import { VscLibrary } from 'react-icons/vsc';
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
      icon: <VscLibrary style={{ fontSize: '1.5rem' }} />,
      link: '/app/geral/biblioteca',
      description: 'Biblioteca',
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
      link: '/app/geral/frequencia',
      description: 'Frequência',
      collapse: false,
    },
    {
      icon: <GiTakeMyMoney style={{ fontSize: '1.5rem' }} />,
      link: '/app/geral/consulta',
      description: 'Consulta Financeira',
      collapse: false,
    },
    {
      icon: <FaHistory style={{ fontSize: '1.5rem' }} />,
      link: '/app/geral/historico',
      description: 'Histórico',
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

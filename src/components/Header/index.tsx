import React, { useState, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FaBars } from 'react-icons/fa';

import { Link, useLocation, useHistory } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
// import { Link as HashLink } from 'react-scroll';

import { Content } from './styles';
import Maconaria from '../../assets/esquadro_compasso.png';

const Header: React.FC = () => {
  const { pathname, hash } = useLocation();
  const [isNavVisible, setNavVisibility] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const history = useHistory();

  const handleScrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleToggleNav = useCallback(() => {
    setNavVisibility(false);
  }, []);

  const handleLogin = useCallback(() => {
    history.push('/app/login');
  }, [history]);
  // console.log(`${pathname} ------ ${hash}`);
  const handleMediaQueryChange = (mediaQuery: any): void => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 700px)');
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const toggleNav = (): void => {
    setNavVisibility(!isNavVisible);
  };

  return (
    <Content>
      <header>
        <img src={Maconaria} alt="Logo Loja" />
        <CSSTransition
          in={!isSmallScreen || isNavVisible}
          timeout={350}
          classNames="NavAnimation"
          unmountOnExit
        >
          <nav>
            <Link
              className={pathname === '/' && hash === '' ? 'active' : ''}
              to="/"
              onClick={handleScrollToTop}
            >
              Home
            </Link>
            <HashLink
              className={hash === '#historia' ? 'active' : ''}
              to="/#historia"
              smooth
              onClick={handleToggleNav}
            >
              História
            </HashLink>
            <HashLink
              className={hash === '#gestao' ? 'active' : ''}
              to="/#gestao"
              smooth
              onClick={handleToggleNav}
            >
              Gestão Atual
            </HashLink>
            <HashLink
              className={hash === '#veneraveis' ? 'active' : ''}
              to="/#veneraveis"
              smooth
              onClick={handleToggleNav}
            >
              Veneráveis
            </HashLink>
            <Link
              className={pathname === '/noticias' ? 'active' : ''}
              to="/noticias"
              onClick={handleScrollToTop}
            >
              Notícias
            </Link>

            <button onClick={handleLogin} type="button">
              Login
            </button>
          </nav>
        </CSSTransition>
        <button type="button" onClick={toggleNav} className="Menu">
          <FaBars />
        </button>
      </header>
    </Content>
  );
};

export default Header;

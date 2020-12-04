import React, { useCallback } from 'react';
import { Container, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';

import { FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

import LogoFooter from '../../assets/novaFlamula.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      left: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: '#0e3a5d',
      minHeight: '360px',
      paddingTop: 32,
      display: 'flex',
      justifyContent: 'flex-end',
      boxShadow: '0 -6px 8px 0 rgba(0, 0, 0, 0.3)',
    },
    mainGrid: {
      padding: '20px 0',
    },
    gridPosition: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    ul: {
      listStyle: 'none',
      padding: '5px 0',
    },
    li: {
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        opacity: 0.5,
      },
    },
    link: {
      textDecoration: 'none',
      color: '#FFF',
      '&:hover': {
        opacity: 0.5,
      },
    },
    titleFooter: {
      fontSize: '24px',
      color: '#FFF',
      marginBottom: '8px',
      position: 'relative',
      borderBottom: '3px solid #FFF',
    },
    address: {
      fontSize: 16,
      padding: '8px 0px',
      display: 'flex',
      alignItems: 'center',
    },
    iconFooter: {
      marginRight: 8,
      color: '#FFF',
    },
    imgFooter: {
      width: 'auto',
      height: 275,
    },
  }),
);

const Footer: React.FC = () => {
  const classes = useStyles();

  const handleScrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <footer className={classes.root}>
      <Container>
        <Grid className={classes.mainGrid} container spacing={2}>
          <Grid className={classes.gridPosition} item xs={12} sm={4}>
            <img
              className={classes.imgFooter}
              src={LogoFooter}
              alt="Logo Footer Loja Fraternidade"
            />
          </Grid>
          <Grid className={classes.gridPosition} item xs={12} sm={4}>
            <p className={classes.titleFooter}>Menu</p>
            <ul className={classes.ul}>
              <li className={classes.li}>
                <FiArrowRight className={classes.iconFooter} />
                <Link
                  onClick={handleScrollToTop}
                  className={classes.link}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className={classes.li}>
                <FiArrowRight className={classes.iconFooter} />
                <HashLink className={classes.link} to="/#historia" smooth>
                  História
                </HashLink>
              </li>
              <li className={classes.li}>
                <FiArrowRight className={classes.iconFooter} />
                <HashLink className={classes.link} to="/#fundadores" smooth>
                  Fundadores
                </HashLink>
              </li>
              <li className={classes.li}>
                <FiArrowRight className={classes.iconFooter} />
                <HashLink className={classes.link} to="/#gestao" smooth>
                  Gestão Atual
                </HashLink>
              </li>
              <li className={classes.li}>
                <FiArrowRight className={classes.iconFooter} />
                <HashLink className={classes.link} to="/#veneraveis" smooth>
                  Veneráveis
                </HashLink>
              </li>
              <li className={classes.li}>
                <FiArrowRight className={classes.iconFooter} />
                <Link
                  onClick={handleScrollToTop}
                  className={classes.link}
                  to="/noticias"
                >
                  Notícias
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid className={classes.gridPosition} item xs={12} sm={4}>
            <p className={classes.titleFooter}>Contatos</p>
            <div className={classes.address}>
              <FaMapMarkerAlt className={classes.iconFooter} size={30} />
              <a
                className={classes.link}
                href="https://www.google.com/maps/place/Loja+Ma%C3%A7%C3%B4nica+Fraternidade,+Caminho+e+Luz/@-20.9157187,-46.9953156,15z/data=!4m5!3m4!1s0x0:0x3dcb91bc489c238e!8m2!3d-20.9157187!4d-46.9953156"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p>
                  Praça São José nº 52, Centro
                  <br />
                  Caixa Postal nº 151
                  <br />
                  São Sebastião do Paraíso - MG
                  <br />
                  CEP: 37950-000
                </p>
              </a>
            </div>
            <div className={classes.address}>
              <FaEnvelope className={classes.iconFooter} size={30} />
              <a
                className={classes.link}
                href="mailto:fcl3216@fraternidadecaminhoeluz.org.br"
              >
                fcl3216@fraternidadecaminhoeluz.org.br
              </a>
            </div>
          </Grid>
        </Grid>

        <a
          className={classes.link}
          href="https://www.emsoft.com.br"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          Desenvolvido por Emsoft Brasil Informática Ltda.&copy;
        </a>
      </Container>
    </footer>
  );
};

export default Footer;

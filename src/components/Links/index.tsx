import React from 'react';
import { Grid, Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import GobMG from '../../assets/gobmg.png';
import Gob from '../../assets/gob.png';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Fade = require('react-reveal/Fade');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
    },
    container: {
      minHeight: '270px',
      backgroundColor: '#0d47a1',
      padding: '16px 16px',
      borderBottomLeftRadius: '50% 40%',
      borderBottomRightRadius: '50% 40%',
    },
    divContainer: {
      display: 'flex',
      flexDirection: 'column',
      color: '#FFF',
      fontWeight: 'bold',
      alignItems: 'center',
    },
    logoGob: {
      paddingTop: 16,
      height: '125px',
      width: 'auto',
    },
    logoGobMG: {
      paddingTop: 16,
      height: '130px',
      width: 'auto',
    },
  }),
);

const Links: React.FC = () => {
  const classes = useStyles();

  return (
    <section style={{ overflow: 'hidden' }}>
      <div className={classes.container}>
        <Container>
          <Grid container spacing={2}>
            <Grid item className={classes.root} xs={12} sm={6}>
              <Fade left>
                <div className={classes.divContainer}>
                  Federada ao
                  <a
                    href="https://www.gob.org.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img className={classes.logoGob} src={Gob} alt="Logo GOB" />
                  </a>
                </div>
              </Fade>
            </Grid>
            <Grid item className={classes.root} xs={12} sm={6}>
              <Fade right>
                <div className={classes.divContainer}>
                  Filiada ao
                  <a
                    href="https://www.gobminas.org.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className={classes.logoGobMG}
                      src={GobMG}
                      alt="Logo GOB-MG"
                    />
                  </a>
                </div>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </div>
    </section>
  );
};

export default Links;

import React from 'react';
import { Container, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Hall from '../../assets/hall.jpeg';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Slide = require('react-reveal/Slide');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    sectionAnchor: {
      position: 'relative',
      background: '#6d1e2bb8',
      color: '#FFF',
      marginTop: 8,
    },
    anchor: {
      position: 'absolute',
      top: -62,
    },
    container: {
      padding: '25px 0',
    },
    title: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px',
    },
    titleText: {
      position: 'relative',
      color: '#FFF',
    },
    imgContent: {
      width: '100%',
      height: 'auto',
      borderRadius: '10px',
    },
    textContent: {
      textAlign: 'center',
    },
  }),
);

const History: React.FC = () => {
  const classes = useStyles();

  return (
    <section className={classes.sectionAnchor}>
      <span id="historia" className={classes.anchor} />
      <div className={classes.container}>
        <Container>
          <div className={classes.title}>
            <h1 className={classes.titleText}>Nossa História</h1>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Slide left>
                <img className={classes.imgContent} src={Hall} alt="Loja" />
              </Slide>
            </Grid>
            <Grid item xs={12} md={8}>
              <Slide right>
                <div className={classes.textContent}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  commodo, urna vel tincidunt porttitor, nisi dui pharetra
                  lorem, sed venenatis nisl ligula nec ipsum. Proin tempor eros
                  eu dui vehicula consectetur a id urna. Aenean a dolor dapibus,
                  hendrerit nunc in, bibendum mauris. Aliquam faucibus euismod
                  massa, a vestibulum leo aliquam non. Integer vitae mauris
                  enim. Ut a lorem nec ex commodo tincidunt sed eget urna. Donec
                  id tempor est. Integer in mauris molestie, efficitur turpis
                  efficitur, imperdiet magna. Duis odio lectus, varius in quam
                  et, tincidunt ornare odio. Curabitur venenatis libero diam,
                  vel placerat quam dictum eget. Maecenas aliquet, nunc quis
                  ultrices eleifend, sem est hendrerit ipsum, a placerat leo
                  tortor a arcu. Pellentesque habitant morbi tristique senectus
                  et netus et malesuada fames ac turpis egestas. Etiam nisi
                  arcu, eleifend vel cursus tincidunt, volutpat ac elit. Integer
                  nec hendrerit diam. Pellentesque nec condimentum lorem.
                </div>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </div>
    </section>
  );
};

export default History;

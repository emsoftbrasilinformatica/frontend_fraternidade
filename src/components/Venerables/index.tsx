import React, { useState, useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import background from '../../assets/background-venerables.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    sectionAnchor: {
      position: 'relative',
      backgroundImage: `url("${background}")`,
      backgroundColor: '#F1F1E6',
      color: '#2d2d2d',
    },
    anchor: {
      position: 'absolute',
      top: -69,
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
      color: '#2d2d2d',
    },
    imgContent: {
      width: '100%',
      height: 'auto',
      borderRadius: '10px',
    },
    textContent: {
      textAlign: 'center',
    },
    mainCarousel: {
      display: 'flex',
      justifyContent: 'center',
      '& .control-arrow': {
        zIndex: 0,
      },
    },
    imgCarousel: {
      height: 400,
    },
  }),
);

const Venerables: React.FC = () => {
  const classes = useStyles();
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, [height, width]);

  return (
    <section className={classes.sectionAnchor}>
      <span id="veneraveis" className={classes.anchor} />
      <div className={classes.container}>
        <Container>
          <div className={classes.title}>
            <h1 className={classes.titleText}>Veneráveis</h1>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Venerables;

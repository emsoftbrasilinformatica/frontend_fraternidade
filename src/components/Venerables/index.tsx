import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Fundacao from '../../assets/fundacao.jpg';
import Fundadores from '../../assets/fundadores.jpg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    sectionAnchor: {
      position: 'relative',
      background: '#6d1e2bb8',
      color: '#FFF',
    },
    anchor: {
      position: 'absolute',
      top: -70,
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
      // console.log(`width: ${width}`);
      // console.log(`height: ${height}`);
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

          <Carousel
            showArrows
            swipeable
            dynamicHeight
            emulateTouch
            infiniteLoop
            /* autoPlay */
            showStatus={false}
            showThumbs={false}
            width={width > 650 ? '50%' : '100%'}
            className={classes.mainCarousel}
          >
            <div>
              <img src={Fundacao} alt="teste" />
            </div>
            <div>
              <img src={Fundadores} alt="teste1" />
            </div>
          </Carousel>
        </Container>
      </div>
    </section>
  );
};

export default Venerables;

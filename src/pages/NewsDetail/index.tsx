import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container as Cont, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { FiArrowLeft } from 'react-icons/fi';
import { Container, ImageCarousel } from './styles';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import background from '../../assets/background-venerables.png';

import api from '../../services/api';
import Loading from '../../components/Loading';

interface params {
  id: string;
}

interface NewsProps {
  image_url: string;
  title: string;
  subtitle: string;
  id: string;
  content: string;
  newsImages: NewsImages[];
}

interface NewsImages {
  image_url: string;
  id: string;
}

const useStyles = makeStyles({
  root: {
    marginTop: 24,
    marginBottom: 24,
  },
  container: {
    backgroundImage: `url("${background}")`,
  },
  bgImage: {
    height: '350px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  content: {
    letterSpacing: 1,
    marginTop: 8,
    whiteSpace: 'pre-line',
    textAlign: 'justify',
    flex: 1,
  },
  topTitle: {
    background: '#6b9ec7',
    padding: 20,
    borderRadius: 20,
    color: '#FFF',
    flex: 1,
    boxShadow: '-1px 0px 41px -12px rgba(0,0,0,0.77)',
  },
  titlePart: {
    display: 'flex',
  },
  contentPart: {
    background: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: '-1px 0px 41px -12px rgba(0,0,0,0.77)',
  },
  buttonBack: {
    background: 'none',
    marginBottom: 16,
    borderRadius: 10,
    color: '#0f5e9e',
    padding: 10,
    borderColor: '#0f5e9e',
    fontWeight: 'bold',
    border: 'solid',
  },
  mainCarousel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .carousel': {
      display: 'flex',
      justifyContent: 'center',
    },
    '& .carousel .thumbs-wrapper': {
      margin: 32,
      background: '#0f5e9e',
      padding: 16,
      borderRadius: 24,
      boxShadow: '-1px 0px 41px -12px rgba(0,0,0,0.77)',
    },
    '& .control-arrow': {
      zIndex: 0,
    },
    '& .carousel .thumbs-wrapper .control-prev.control-arrow': {
      background: '#000',
    },
    '& .carousel .thumbs-wrapper .control-next.control-arrow': {
      background: '#000',
    },
  },
});

const NewsDetail: React.FC = () => {
  const classes = useStyles();
  const params: params = useParams();
  const [news, setNews] = useState<NewsProps>();
  const history = useHistory();
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, [height, width]);

  const handleScrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/news/show/${params.id}`)
      .then(res => {
        setNews(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
    handleScrollToTop();
  }, [params.id, handleScrollToTop]);

  const handleBackToNews = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container className={classes.container}>
      <Header />
      {loading ? (
        <Loading />
      ) : (
        <Cont className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div
                className={classes.bgImage}
                style={{ backgroundImage: `url('${news?.image_url}')` }}
              />
            </Grid>
            <Grid className={classes.titlePart} item xs={12} md={6}>
              <div className={classes.topTitle}>
                <h1 className={classes.title}>{news?.title}</h1>
                <h3>{news?.subtitle}</h3>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item className={classes.content}>
              <div className={classes.contentPart}>{news?.content}</div>
            </Grid>
          </Grid>
          <Carousel
            showArrows
            swipeable
            dynamicHeight
            emulateTouch
            infiniteLoop
            /* autoPlay */
            showStatus={false}
            showThumbs
            width={width > 650 ? '50%' : '100%'}
            className={classes.mainCarousel}
            showIndicators={false}
            useKeyboardArrows
          >
            {news?.newsImages.map(image => (
              <ImageCarousel key={image.id} image_url={image.image_url}>
                <img src={image.image_url} alt="" />
              </ImageCarousel>
            ))}
          </Carousel>
          <button
            onClick={handleBackToNews}
            className={classes.buttonBack}
            type="button"
          >
            <FiArrowLeft />
            Voltar
          </button>
        </Cont>
      )}
      <Footer />
    </Container>
  );
};

export default NewsDetail;

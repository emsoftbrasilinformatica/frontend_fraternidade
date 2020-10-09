import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container as Cont, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { FiArrowLeft } from 'react-icons/fi';
import { Container } from './styles';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import api from '../../services/api';

interface params {
  id: string;
}

interface NewsProps {
  image_url: string;
  title: string;
  subtitle: string;
  id: string;
  content: string;
}

const useStyles = makeStyles({
  root: {
    marginTop: 24,
    marginBottom: 24,
  },
  bgImage: {
    height: '350px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
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
  },
  topTitle: {
    background: '#6d1e2bb8',
    padding: 20,
    borderRadius: 20,
    color: '#FFF',
    flex: 1,
  },
  titlePart: {
    display: 'flex',
  },
  contentPart: {
    background: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  buttonBack: {
    background: 'none',
    marginBottom: 16,
    borderRadius: 10,
    color: '#631925',
    padding: 10,
    borderColor: '#631925',
    fontWeight: 'bold',
    border: 'solid',
  },
});

const NewsDetail: React.FC = () => {
  const classes = useStyles();
  const params: params = useParams();
  const [news, setNews] = useState<NewsProps>();
  const history = useHistory();

  const handleScrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    api.get(`/news/show/${params.id}`).then(res => {
      console.log(res.data.content);
      setNews(res.data);
    });
    handleScrollToTop();
  }, [params.id, handleScrollToTop]);

  const handleBackToNews = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Container>
      <Header />

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
        <button
          onClick={handleBackToNews}
          className={classes.buttonBack}
          type="button"
        >
          <FiArrowLeft />
          Voltar
        </button>
      </Cont>

      <Footer />
    </Container>
  );
};

export default NewsDetail;

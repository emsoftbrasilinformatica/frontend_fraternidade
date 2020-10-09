import React, { useState, useEffect, useMemo } from 'react';

import { Container, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { format } from 'date-fns';

import New from './NewHome';

import api from '../../services/api';

interface NewsData {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  created_at: Date;
  date: Date;
  formattedDate: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    sectionAnchor: {
      position: 'relative',
      marginBottom: 32,
    },
    anchor: {
      position: 'absolute',
      top: -90,
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
      color: '#631925',
    },
    cardPosition: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

const News: React.FC = () => {
  const [news, setNews] = useState<NewsData[]>([]);
  const classes = useStyles();

  useEffect(() => {
    api.get('/news/recents').then(res => {
      setNews(res.data);
    });
  }, []);

  const formattedNews = useMemo(() => {
    return news.map(oneNews => {
      const dateToBeFormatted = new Date(oneNews.date);
      return {
        ...oneNews,
        formattedDate: format(dateToBeFormatted, 'dd/MM/yyyy'),
      };
    });
  }, [news]);

  return (
    <section className={classes.sectionAnchor}>
      <span id="news" className={classes.anchor} />
      <div className={classes.container}>
        <Container>
          <div className={classes.title}>
            <h1 className={classes.titleText}>Últimas Notícias</h1>
          </div>
          <Grid container spacing={2}>
            {formattedNews.map(oneNews => (
              <Grid
                key={oneNews.id}
                className={classes.cardPosition}
                item
                xs={12}
                sm={4}
              >
                <New
                  image={oneNews.image_url}
                  title={oneNews.title}
                  description={oneNews.subtitle}
                  link={oneNews.id}
                  date={oneNews.formattedDate}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </section>
  );
};

export default News;

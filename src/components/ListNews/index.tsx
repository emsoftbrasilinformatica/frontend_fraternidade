import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import { format } from 'date-fns';
import NewNews from './NewNews';
import api from '../../services/api';

interface News {
  title: string;
  subtitle: string;
  image_url: string;
  id: string;
  created_at: Date;
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 16,
    },
    news: {
      marginTop: 16,
      marginBottom: 16,
    },
    oneNews: {
      display: 'flex',
      justifyContent: 'center',
    },
    pagination: {
      backgroundColor: '#915963',
      borderRadius: '20px',
      padding: '10px',
    },
  }),
);

const ListNews: React.FC = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [news, setNews] = useState<News[]>([]);
  const [currentNews, setCurrentNews] = useState<News[]>([]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number): void => {
      setPage(value);

      const indexOfLastNews = value * 6;
      const indexOfFirstNews = indexOfLastNews - 6;
      const current = news.slice(indexOfFirstNews, indexOfLastNews);
      setCurrentNews(current);
    },
    [news],
  );

  useEffect(() => {
    api.get('/news').then(res => {
      const newsReceived: News[] = res.data;
      setNews(newsReceived);
      setCurrentNews(newsReceived.slice(0, 6));
    });
  }, []);

  const numberPages = useMemo(() => {
    return Math.ceil(news.length / 6);
  }, [news.length]);

  const formattedNews = useMemo(() => {
    return currentNews.map(oneNews => {
      const dateToBeFormatted = new Date(oneNews.created_at);
      return {
        ...oneNews,
        formattedDate: format(dateToBeFormatted, 'dd/MM/yyyy'),
      };
    });
  }, [currentNews]);

  return (
    <Container>
      <Grid className={classes.news} container spacing={2}>
        {formattedNews.map((el, index) => {
          return (
            <Grid className={classes.oneNews} item xs={12} md={4} key={el.id}>
              <NewNews
                title={el.title}
                description={el.subtitle}
                image={el.image_url}
                link={el.id}
                date={el.formattedDate}
              />
            </Grid>
          );
        })}
      </Grid>
      <div className={classes.root}>
        <Pagination
          className={classes.pagination}
          count={numberPages}
          page={page}
          onChange={handleChange}
        />
      </div>
    </Container>
  );
};

export default ListNews;

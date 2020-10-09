import React, { useEffect, useState, useMemo } from 'react';

import Carousel from 'react-multi-carousel';
import { Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { format } from 'date-fns';
import NewTop from './NewTop';
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
    mainNews: {
      height: '100%',
    },
    firtOfRigth: {
      marginBottom: 16,
    },
    carrousel: {
      '& .react-multiple-carousel__arrow': {
        zIndex: 0,
      },
    },
  }),
);
const TopNews: React.FC = () => {
  const classes = useStyles();
  const [news, setNews] = useState<NewsData[]>([]);

  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, [height, width]);

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

  if (width < 576) {
    return <></>;
  }
  return (
    <section>
      <div className={classes.container}>
        <Container>
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlay
            autoPlaySpeed={4000}
            centerMode={false}
            className={classes.carrousel}
            containerClass="container-with-dots"
            dotListClass=""
            draggable
            focusOnSelect={false}
            infinite
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
              desktop: {
                breakpoint: {
                  max: 3000,
                  min: 1024,
                },
                items: 2,
                partialVisibilityGutter: 40,
              },
              mobile: {
                breakpoint: {
                  max: 464,
                  min: 0,
                },
                items: 1,
                partialVisibilityGutter: 30,
              },
              tablet: {
                breakpoint: {
                  max: 1024,
                  min: 464,
                },
                items: 1,
                partialVisibilityGutter: 30,
              },
            }}
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
          >
            {formattedNews.map(oneNews => (
              <NewTop
                key={oneNews.id}
                image={oneNews.image_url}
                title={oneNews.title}
                description={oneNews.subtitle}
                link={oneNews.id}
                date={oneNews.formattedDate}
              />
            ))}
          </Carousel>
        </Container>
      </div>
    </section>
  );
};

export default TopNews;

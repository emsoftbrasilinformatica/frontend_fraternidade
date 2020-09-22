import React, { useState, useEffect } from 'react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Person from './Person';

import api from '../../services/api';

interface ManagementMember {
  user: {
    id: string;
    avatar_url: string;
    name: string;
  };
  administrative_function: {
    description: string;
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    sectionAnchor: {
      position: 'relative',
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
      color: '#631925',
    },
    imgContent: {
      width: '100%',
      height: 'auto',
      borderRadius: '10px',
    },
    textContent: {
      textAlign: 'center',
    },
    contentCarousel: {
      display: 'flex',
      justifyContent: 'center',
    },
    carrousel: {
      '& .react-multiple-carousel__arrow': {
        zIndex: 0,
      },
    },
  }),
);

const CurrentManagement: React.FC = () => {
  const classes = useStyles();
  const [members, setMembers] = useState<ManagementMember[]>([]);

  useEffect(() => {
    api.get('/managements/show/current').then(res => {
      setMembers(res.data.management_members);
    });
  }, []);

  return (
    <section className={classes.sectionAnchor}>
      <span id="gestao" className={classes.anchor} />
      <div className={classes.container}>
        <Container>
          <div className={classes.title}>
            <h1 className={classes.titleText}>Gestão Atual</h1>
          </div>

          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlay
            autoPlaySpeed={3000}
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
                items: 4,
                partialVisibilityGutter: 40,
              },
              mobile: {
                breakpoint: {
                  max: 700,
                  min: 0,
                },
                items: 1,
                partialVisibilityGutter: 30,
              },
              tablet: {
                breakpoint: {
                  max: 1024,
                  min: 700,
                },
                items: 3,
                partialVisibilityGutter: 30,
              },
            }}
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
          >
            {members.map(member => (
              <Person
                key={member.user.id}
                name={member.user.name}
                occupation={member.administrative_function.description}
                image={member.user.avatar_url}
              />
            ))}
          </Carousel>
        </Container>
      </div>
    </section>
  );
};

export default CurrentManagement;

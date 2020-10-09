import React, { useState, useEffect, useMemo } from 'react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import userDefault from '../../assets/user-default.png';
import backgroundManagement from '../../assets/background-management.png';
import orador from '../../assets/orador_silver.png';
import veneravel from '../../assets/vm_silver.png';
import primeiroVigilante from '../../assets/primeiro_vigilante_silver.png';
import segundoVigilante from '../../assets/segundo_vigilante_silver.png';
import tesoureiro from '../../assets/tesoureiro_silver.png';
import chanceler from '../../assets/chanceler_silver.png';
import secretario from '../../assets/secretario_silver.png';

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
    order: number;
    admin: boolean;
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    sectionAnchor: {
      position: 'relative',
      backgroundColor: '#0f5e9e',
      backgroundImage: `url(${backgroundManagement})`,
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
      color: '#fff',
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
  const jewels = [
    { order: 1, image: veneravel },
    { order: 2, image: primeiroVigilante },
    { order: 3, image: segundoVigilante },
    { order: 4, image: orador },
    { order: 5, image: secretario },
    { order: 6, image: tesoureiro },
    { order: 7, image: chanceler },
  ];

  useEffect(() => {
    api.get('/managements/show/current').then(res => {
      setMembers(res.data.management_members);
    });
  }, []);

  const orderedMembers = useMemo(() => {
    return members.sort((a, b) => {
      if (a.administrative_function.order > b.administrative_function.order) {
        return 1;
      }
      return -1;
    });
  }, [members]);

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
            // autoPlay
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
            {orderedMembers.map(member => {
              if (member.administrative_function.admin) {
                return (
                  <Person
                    key={member.user.id}
                    name={member.user.name}
                    occupation={member.administrative_function.description}
                    image={
                      member.user.avatar_url
                        ? member.user.avatar_url
                        : userDefault
                    }
                    jewel={
                      jewels.find(
                        jewel =>
                          jewel.order === member.administrative_function.order,
                      )?.image
                    }
                  />
                );
              }
              return null;
            })}
          </Carousel>
        </Container>
      </div>
    </section>
  );
};

export default CurrentManagement;

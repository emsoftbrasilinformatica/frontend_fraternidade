import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Section } from './styles';

import userDefault from '../../assets/user-default.png';

import Person from './Person';
import api from '../../services/api';

interface Management {
  id: string;
  last_year: number;
  start_year: number;
  management_members: ManagementMember[];
}

interface ManagementMember {
  administrative_function: {
    admin: boolean;
    description: string;
    order: number;
  };
  user: {
    name: string;
    avatar_url: string;
  };
}

interface ManagementFormatted {
  id: string;
  years: string;
  venerable: {
    name: string;
    avatar_url: string;
  };
  members: Member[];
}

interface Member {
  name: string;
  occupation: string;
  order: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    anchor: {
      position: 'absolute',
      top: -69,
    },
    container: {
      padding: '30px 0 80px',
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
    carrousel: {
      '& .react-multiple-carousel__arrow': {
        zIndex: 0,
      },
    },
  }),
);

const Venerables: React.FC = () => {
  const classes = useStyles();
  const [managements, setManagements] = useState<ManagementFormatted[]>([]);

  useEffect(() => {
    api.get<Management[]>('/managements/inative/index').then(res => {
      const managementsToBeFormatted: ManagementFormatted[] = res.data.map(
        management => {
          const venerable = management.management_members.find(
            member => member.administrative_function.order === 1,
          );

          const membersFiltered: ManagementMember[] = management.management_members.filter(
            member => member.administrative_function.admin,
          );

          const members: Member[] = membersFiltered.map(member => {
            return {
              name: member.user.name,
              occupation: member.administrative_function.description,
              order: member.administrative_function.order,
            };
          });

          return {
            id: management.id,
            years: `${management.start_year}/${management.last_year}`,
            venerable: {
              name: venerable ? venerable.user.name : '',
              avatar_url: venerable ? venerable.user.avatar_url : '',
            },
            members,
          };
        },
      );
      setManagements(managementsToBeFormatted);
    });
  }, []);

  return (
    <Section>
      <span id="veneraveis" className={classes.anchor} />
      <div className={classes.container}>
        <Container>
          <div className={classes.title}>
            <h1 className={classes.titleText}>Veneráveis</h1>
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
            {managements.map(management => (
              <Person
                key={management.id}
                name={management.venerable.name}
                years={management.years}
                image={
                  management.venerable.avatar_url
                    ? management.venerable.avatar_url
                    : userDefault
                }
                members={management.members}
              />
            ))}
          </Carousel>
        </Container>
      </div>
    </Section>
  );
};

export default Venerables;

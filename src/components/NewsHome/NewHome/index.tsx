import React from 'react';
import { shade } from 'polished';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';

import { Link } from 'react-router-dom';
import { FiArrowRightCircle } from 'react-icons/fi';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Zoom = require('react-reveal/Zoom');

interface NewHomeProps {
  image: string;
  title: string;
  description: string;
  link: string;
  date: string;
}

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  card: {
    background: '#f1c543',
    color: '#1c537e',
    height: 170,
  },
  cardActions: {
    background: shade(0.25, '#f1c543'),
    display: 'flex',
    justifyContent: 'center',
  },
  linkCard: {
    color: '#1c537e',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  iconLink: {
    marginLeft: 8,
  },
  bgCardMedia: {
    height: '250px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: '#f1c543',
    transition: 'all .5s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
});

const New: React.FC<NewHomeProps> = ({
  image,
  link,
  description,
  title,
  date,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <div style={{ flex: 1 }}>
      <Zoom>
        <Card className={classes.root}>
          <CardMedia>
            <div
              className={classes.bgCardMedia}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            />
          </CardMedia>
          <CardContent className={classes.card}>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" component="p">
              {description}
            </Typography>
            <div style={{ fontSize: 14, textAlign: 'right', marginTop: 8 }}>
              {date}
            </div>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Link className={classes.linkCard} to={`/noticias/${link}`}>
              LER MAIS
              <FiArrowRightCircle className={classes.iconLink} />
            </Link>
          </CardActions>
        </Card>
      </Zoom>
    </div>
  );
};

export default New;

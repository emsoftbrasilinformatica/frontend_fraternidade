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

interface NewTopProps {
  image: string;
  title: string;
  description: string;
  link: string;
  date: string;
}

const useStyles = makeStyles({
  root: {
    maxWidth: '100%',
    marginRight: 16,
  },
  card: {
    background: '#915963',
    color: '#FFF',
  },
  cardActions: {
    background: shade(0.25, '#915963'),
    display: 'flex',
    justifyContent: 'center',
  },
  linkCard: {
    color: '#FFF',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  iconLink: {
    marginLeft: 8,
  },
  bgCardMedia: {
    height: '400px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cardMedia: {
    transition: 'all .5s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
});

const NewTop: React.FC<NewTopProps> = ({
  image,
  link,
  description,
  title,
  date,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia className={classes.cardMedia}>
        <div
          className={classes.bgCardMedia}
          style={{ backgroundImage: `url('${image}')` }}
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
  );
};

export default NewTop;

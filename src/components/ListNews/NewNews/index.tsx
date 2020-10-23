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
    flex: '1',
    boxShadow: '10px 2px 11px 4px rgba(0,0,0,0.41)',
    marginBottom: 32,
  },
  card: {
    background: '#0f5e9e',
    color: '#FFF',
    height: 170,
  },
  cardActions: {
    background: shade(0.25, '#0f5e9e'),
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
    height: '250px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundColor: '#0f5e9e',
    transition: 'all .5s',
    '&:hover': {
      transform: 'scale(1.1)',
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
  );
};

export default NewTop;

import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
    loadingStyle: {
      color: '#0093DD',
      width: '80px !important',
      height: '80px !important',
    },
  }),
);

const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.loadingStyle} />
    </div>
  );
};

export default Loading;

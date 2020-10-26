import React, { useCallback, useMemo, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button as ButtonMT,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Container, Card, Button } from './styles';

interface PersonProps {
  image: string;
  name: string;
  years: string;
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
      width: '100%',
      maxWidth: 360,
      backgroundColor: '#0f5e9e',
      color: '#FFF',
      borderRadius: 10,
      fontSize: 16,
      '& .MuiTypography-body2': {
        fontSize: 16,
      },
      '& .MuiListItemText-primary': {
        fontWeight: 'bold',
      },
      '& .MuiTypography-colorTextSecondary': {
        color: '#FFF',
        fontSize: 14,
      },
    },
    modalTitle: {
      background: '#0f5e9e',
      color: '#FFF',
      flex: '0 0 auto',
      margin: 0,
      padding: '9px 24px',
      textAlign: 'center',
    },
    modalContent: {
      margin: '15px 0',
      fontWeight: 'bold',
    },
    iconDialog: {
      marginRight: 8,
    },
    modalActions: {
      background: '#0f5e9e',
    },
    nested: {
      paddingLeft: theme.spacing(4),
      borderBottom: '1px solid #e0e0e0',
    },
  }),
);

const Person: React.FC<PersonProps> = ({
  name,
  image,
  years,
  members,
  ...rest
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();

  const handleOpenDialog = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback((): void => {
    setOpenDialog(false);
  }, []);

  const membersOrdered = useMemo(() => {
    return members.sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }
      return -1;
    });
  }, [members]);

  return (
    <Container>
      <Card>
        <div
          style={{
            backgroundImage: `url("${image}")`,
            borderRadius: '50%',
            width: 150,
            height: 150,
            boxShadow: '0px 0px 10px -1px rgba(0, 0, 0, 0.75)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <h1 style={{ textAlign: 'center', paddingTop: 20 }}>{name}</h1>
        <div>{years}</div>

        <Button onClick={handleOpenDialog}>Diretoria</Button>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className={classes.modalTitle} id="alert-dialog-title">
          {/* <BiBookmarkPlus className={classes.iconDialog} /> */}
          Membros da Diretoria
        </DialogTitle>
        <Divider />
        <DialogContent style={{ padding: 16 }}>
          <List dense className={classes.root}>
            {membersOrdered.map(member => (
              <ListItem key={member.order} button>
                <ListItemText
                  primary={member.occupation}
                  secondary={member.name}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <Divider />
        <DialogActions>
          <ButtonMT onClick={handleClose} className="buttonCancel">
            Fechar
          </ButtonMT>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Person;

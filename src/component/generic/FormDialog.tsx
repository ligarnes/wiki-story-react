import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button, DialogActions} from "@material-ui/core";

export interface Props {
  open: boolean;
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  createHandler: () => void;
  cancelHandler: () => void;
}

export default function FormDialog(props: React.PropsWithChildren<Props>) {

  let desc = (<></>);
  if (props.description) {
    desc = (
      <DialogContentText>
        {props.description}
      </DialogContentText>
    );
  }

  const primary = props.primaryLabel ? props.primaryLabel : "Create";
  const secondary = props.secondaryLabel ? props.secondaryLabel : "Cancel";

  return (
    <Dialog open={props.open} onClose={props.cancelHandler} PaperProps={{elevation: 0}}>
      <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        {desc}
        {props.children}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.cancelHandler} color="secondary" variant="contained"> {secondary} </Button>
        <Button onClick={props.createHandler} color="primary" variant="contained"> {primary} </Button>
      </DialogActions>
    </Dialog>
  );
}

import React, {FunctionComponent, useState} from "react";
import {Alert, AlertTitle} from "@material-ui/lab";
import {Snackbar} from "@material-ui/core";
import {NotificationController, NotificationListener} from "../service/NotificationManager";

export interface Props {
  notificationManager: NotificationController;
}

function generateItem(data: string): React.ReactNode {
  return <li key={data}>{data}</li>;
}

export const SnackNotificationComponent: FunctionComponent<Props> = (props: Props) => {

  const [key, setKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('info' as 'success' | 'info' | 'warning' | 'error');
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(<span/>);

  const listener: NotificationListener = {
    errorNotification(errors: Array<string>): void {
      setTitle("Error");
      setSeverity("error");
      if (errors.length > 1) {
        setContent(<ul> {errors.map(generateItem)} </ul>)
      } else {
        setContent(<>{errors[0]}</>)
      }
      setOpen(true);
      setKey(new Date().getTime());
    }, successNotification(message: string): void {
      setTitle("Success");
      setSeverity("success");
      setContent(<span>{message}</span>);
      setOpen(true);
      setKey(new Date().getTime());
    }, warnNotification(message: string): void {
      setTitle("Warning");
      setSeverity("success");
      setContent(<span>{message}</span>);
      setOpen(true);
      setKey(new Date().getTime());
    }
  }

  props.notificationManager.setComponent(listener);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar key={key} open={open} autoHideDuration={15000} onClose={handleClose}
              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
      <Alert onClose={handleClose} severity={severity}>
        <AlertTitle>{title}</AlertTitle>
        {content}
      </Alert>
    </Snackbar>
  );
}

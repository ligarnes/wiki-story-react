import React from "react";
import {Alert, AlertTitle, CircularProgress} from "@mui/material";

export interface Notification {
  title: string;
  errors: Array<string>;
  success: string | null;
  waiting: string | null;
}

/**
 * Create an empty notification.
 *
 * @return {Notification} the notification
 */
export function emptyNotification(): Notification {
  return {title: "", errors: [], success: null, waiting: null} as Notification;
}

/**
 * Create an error notification.
 *
 * @param {string} title the title
 * @param {string} messages the messages
 * @return {Notification} the notification
 */
export function errorNotification(title: string, ...messages: Array<string>): Notification {
  return {title: title, errors: messages, success: null, waiting: null} as Notification;
}

/**
 * Create a success notification.
 *
 * @param {string} title the title
 * @param {string} message the message
 * @return {Notification} the notification
 */
export function successNotification(title: string, message: string): Notification {
  return {title: title, success: message, errors: [], waiting: null} as Notification;
}

/**
 * Create a waiting notification.
 *
 * @param {string} title the title
 * @param {string} message the message
 * @return {Notification} the notification
 */
export function waitingNotification(title: string, message: string): Notification {
  return {title: title, waiting: message, errors: [], success: null} as Notification;
}

export interface Props {
  notification: Notification;
}


export default class AlertComponent extends React.Component<Props, unknown> {

  private getSuccessMessage = () => {
    return (
      <Alert severity="success">
        <AlertTitle>{this.props.notification.title}</AlertTitle>
        {this.props.notification.success}
      </Alert>
    );
  }

  private static generateItem = (data: string): React.ReactNode => {
    return <li key={data}>{data}</li>;
  }

  private getErrorMessage = () => {
    let content = <>{this.props.notification.errors[0]}</>;
    if (this.props.notification.errors.length > 1) {
      content = <ul>
        {this.props.notification.errors.map(AlertComponent.generateItem)}
      </ul>;
    }

    return (
      <Alert severity="error">
        <AlertTitle>{this.props.notification.title}</AlertTitle>
        {content}
      </Alert>);
  }

  private getWaitingMessage = () => {
    return (
      <Alert severity="info">
        <AlertTitle>{this.props.notification.title}</AlertTitle>
        {this.props.notification.waiting}
        <CircularProgress/>
      </Alert>);
  }


  render(): React.ReactNode {
    if (this.props.notification.waiting !== null) {
      return this.getWaitingMessage()
    } else if (this.props.notification.errors.length > 0) {
      return this.getErrorMessage();
    } else if (this.props.notification.success !== null) {
      return this.getSuccessMessage();
    }

    return <div/>;
  }

}

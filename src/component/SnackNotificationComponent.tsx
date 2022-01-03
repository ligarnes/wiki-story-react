import React, {FunctionComponent} from "react";
import {useRecoilState} from "recoil";
import {Notification, notificationAtom} from "../atom/NotificationAtom";
import {Alert, AlertTitle, Snackbar} from "@mui/material";


export const SnackNotificationComponent: FunctionComponent<unknown> = () => {
  const [notifications, setNotifications] = useRecoilState(notificationAtom);

  const handleCloseNotification = (toRemove: string) => {
    setNotifications([]);
  };

  const createNotif = (notification: Notification) => {
    return (
      <Snackbar key={`notif-${notification.title}`} open={true} autoHideDuration={15000}
                onClose={() => handleCloseNotification(notification.title)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
        <Alert onClose={() => handleCloseNotification(notification.title)} severity={notification.severity}>
          <AlertTitle>{notification.title}</AlertTitle>
          {notification.text}
        </Alert>
      </Snackbar>);
  }

  return (
    <>
      {notifications.map(notif => createNotif(notif))}
    </>
  );
}

import {atom, DefaultValue, selector} from "recoil";
import {AlertColor} from "@mui/material";

export interface Notification {
  title: string;
  text: string;
  severity: AlertColor;
}

export const notificationAtom = atom<Notification[]>({
  key: 'notifications',
  default: [],
});


export const addNotificationSelector = selector<Notification>({
  key: 'addNotification',
  get: ({get}) => {
    return get(notificationAtom)[0];
  },
  set: ({set, get}, newNotification) => {
    if (guardRecoilDefaultValue(newNotification)) return;
    set<Notification[]>(notificationAtom, [...get(notificationAtom), newNotification]);
  },
});

const guardRecoilDefaultValue = (candidate: any): candidate is DefaultValue => {
  return candidate instanceof DefaultValue;
};

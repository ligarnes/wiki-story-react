import {atom} from "recoil";
import {UserProfile} from "../service/user/UserService";

export const userIdAtom = atom<string | undefined>({
  key: 'userId',
  default: undefined,
});

export const userAtom = atom<UserProfile | undefined>({
  key: 'user',
  default: undefined,
});
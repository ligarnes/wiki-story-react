import {atom} from "recoil";
import ServiceLocatorV2 from "../service/v2/ServiceLocatorV2";

export const serviceLocatorAtom = atom<ServiceLocatorV2 | undefined>({
  key: 'serviceLocator',
  default: undefined,
});
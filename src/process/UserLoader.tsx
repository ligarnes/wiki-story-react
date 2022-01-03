import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {useEffect} from "react";
import {serviceLocatorAtom} from "../atom/ServiceLocatorAtom";
import {userAtom, userIdAtom} from "../atom/UserAtom";

export function UserLoader() {
  const serviceLocator = useRecoilValue(serviceLocatorAtom);
  const [userId, setUserId] = useRecoilState(userIdAtom);
  const setUser = useSetRecoilState(userAtom);


  useEffect(() => {
    const realUserId = serviceLocator?.loginService.getUserId();
    if (userId !== realUserId) {
      setUserId(realUserId);
    }
  }, [serviceLocator, userId, setUserId]);

  useEffect(() => {
    if (userId) {
      serviceLocator?.userService.getUserProfile(userId).then(setUser);
    }
  }, [serviceLocator, userId, setUser]);

  return (<></>);
}
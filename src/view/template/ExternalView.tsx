import React, {FunctionComponent} from 'react';
import {useHistory} from "react-router";
import {useRecoilValue} from "recoil";
import {serviceLocatorAtom} from "../../atom/ServiceLocatorAtom";

export const ExternalTemplateView: FunctionComponent<unknown> = (props: React.PropsWithChildren<unknown>) => {
  const history = useHistory();
  const serviceLocator = useRecoilValue(serviceLocatorAtom);

  if (serviceLocator?.loginService.isLogged()) {
    history.push('/my-wikis');
  }

  return (<div> {props.children} </div>);
}
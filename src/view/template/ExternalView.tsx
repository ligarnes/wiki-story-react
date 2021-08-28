import React, {FunctionComponent} from 'react';
import {useHistory} from "react-router";
import {getApplication} from "../../Application";

export const ExternalTemplateView: FunctionComponent<unknown> = (props: React.PropsWithChildren<unknown>) => {
  const history = useHistory();
  if (getApplication().serviceLocator.loginService.isLogged()) {
    history.push('/my-wikis');
  }
  
  return (<div> {props.children} </div>);
}
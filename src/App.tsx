import {useSetRecoilState} from "recoil";
import {useEffect} from "react";
import Configuration from "./Configuration";
import {serviceLocatorAtom} from "./atom/ServiceLocatorAtom";
import LoginService from "./service/user/LoginService";
import UserService from "./service/user/UserService";
import {BackendQueryEngine, QueryEngineImpl} from "./service/QueryEngine";
import {BackendQueryEngineStubImpl} from "./service/stub/BackendQueryEngineStub";
import {PageLoader} from "./process/PageLoader";
import {WikiSync} from "./process/WikiSync";
import WikiV2Service from "./service/v2/WikiV2Service";
import ArticleV2Service from "./service/v2/ArticleV2Service";
import {UserLoader} from "./process/UserLoader";

export function App() {

  const setServiceLocator = useSetRecoilState(serviceLocatorAtom);

  useEffect(() => {
    async function init() {
      const configuration = new Configuration();
      await configuration.init();
      const backendQueryEngine = createBackendEngine(configuration);

      return {
        loginService: new LoginService(backendQueryEngine),
        wikiService: new WikiV2Service(backendQueryEngine),
        articleService: new ArticleV2Service(backendQueryEngine),
        userService: new UserService(backendQueryEngine)
      };
    }

    init().then(setServiceLocator);
  }, [setServiceLocator]);

  return (
    <>
      <PageLoader/>
      <UserLoader/>
      <WikiSync/>
    </>
  );
}

function createBackendEngine(configuration: Configuration): BackendQueryEngine {
  if (configuration.useStub()) {
    console.log("Use stub");
    return new BackendQueryEngineStubImpl();
  } else {
    return new QueryEngineImpl(configuration.getBackendUrl());
  }
}
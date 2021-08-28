import Configuration from "./Configuration";
import ServiceLocator from "./service/ServiceLocator";
import {BackendQueryEngine, QueryEngineImpl} from "./service/QueryEngine";
import {BackendQueryEngineStubImpl} from "./service/stub/BackendQueryEngineStub";
import {NotificationController, NotificationControllerImpl} from "./service/NotificationManager";
import LoginService from "./service/user/LoginService";
import WikiService from "./service/WikiService";
import UserService from "./service/user/UserService";

let application: Application | null = null;

/**
 * Initialize the application.
 *
 * @param {ServiceLocator} services the service locator
 * @return {Promise<Application>} the application
 */
export async function initApplication(services?: ServiceLocator): Promise<Application> {
  if (services) {
    application = new Application(services, new NotificationControllerImpl());
  } else {
    const serviceLocator = await loadFromConfiguration();
    application = new Application(serviceLocator, new NotificationControllerImpl());
  }

  return application;
}

/**
 * Load from configuration.
 *
 * @return {Promise<ServiceLocator>} the Service locator
 */
async function loadFromConfiguration(): Promise<ServiceLocator> {
  try {
    const configuration = new Configuration();
    await configuration.init();

    const backendQueryEngine = createBackendEngine(configuration);

    return {
      loginService: new LoginService(backendQueryEngine),
      wikiService: new WikiService(backendQueryEngine),
      userService: new UserService(backendQueryEngine)
    };
  } catch (e) {
    throw new Error("Failed to initialize the application");
  }
}

function createBackendEngine(configuration: Configuration): BackendQueryEngine {
  if (configuration.useStub()) {
    console.log("Use stub");
    return new BackendQueryEngineStubImpl();
  } else {
    return new QueryEngineImpl(configuration.getBackendUrl());
  }
}

export default class Application {

  private serviceLocatorInstance: ServiceLocator;
  notificationManager: NotificationController;

  constructor(serviceLocator: ServiceLocator, notificationManager: NotificationController) {
    this.serviceLocatorInstance = serviceLocator;
    this.notificationManager = notificationManager;
  }

  get serviceLocator(): ServiceLocator {
    return this.serviceLocatorInstance;
  }
}

/**
 * Retrieve the application
 *
 * @return {Application} the application instance
 */
export function getApplication(): Application {
  if (application === null) {
    throw new Error("The application must be initialized");
  }

  return application;
}
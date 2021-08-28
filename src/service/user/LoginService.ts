import {BackendQueryEngine} from "../QueryEngine";
import {JwtHelper, JwtToken} from "./JwtUtils";

export interface User {
  id?: string,
  username: string,
  password: string,
  email: string
}

export interface RegistrationRequest {
  username: string,
  password: string,
  email: string,
  acceptTerms: boolean
}

export class RegistrationError extends Error {
  errors: Array<string>;

  constructor(message: string, errors: Array<string>) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RegistrationError.prototype);
    this.errors = errors;
  }

  getErrors = () => {
    return this.errors;
  }
}

interface UserLogin {
  usernameOrEmail: string;
  password: string;
}

interface LoginSuccess {
  jwtToken: string;
}

export default class LoginService {
  private queryEngine: BackendQueryEngine;

  constructor(queryEngine: BackendQueryEngine) {
    this.queryEngine = queryEngine;
  }

  register(request: RegistrationRequest): Promise<any> {
    return new Promise<User>((resolve) => resolve(this.validateParameters(request)))
      .then(this.sendRegister)
  }

  private sendRegister = (user: User): Promise<any> => {
    return this.queryEngine.post("/register", user);
  }

  private validateParameters = (request: RegistrationRequest): User => {
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let error = false;
    const reasons: string[] = [];
    if (request.username.length < 4) {
      error = true;
      reasons.push("The username is too short, must be at least 4 character.");
    }
    if (!emailRegex.test(request.email)) {
      error = true;
      reasons.push("The email is invalid.")
    }
    if (request.password.length < 6) {
      error = true;
      reasons.push("The password is too short, must be at least 6 character.");
    }
    if (!request.acceptTerms) {
      error = true;
      reasons.push("You must accept the terms and conditions.")
    }

    if (error) {
      throw new RegistrationError("Validation error", reasons);
    }

    return {
      username: request.username,
      email: request.email,
      password: request.password
    };
  }

  login(username: string, password: string): Promise<any> {

    const login: UserLogin = {
      usernameOrEmail: username,
      password: password
    }
    return this.queryEngine.post("/login", login)
      .then((resp) => {
        const success: LoginSuccess = resp as LoginSuccess;
        // Store JWT token
        window.sessionStorage.setItem('user-token', success.jwtToken);
      });
  }

  logout() {
    window.sessionStorage.removeItem('user-token');
  }

  getToken = (): JwtToken | undefined => {
    const token = window.sessionStorage.getItem('user-token');
    if (token !== null) {
      return new JwtHelper().decodeToken(token);
    }
    return undefined;
  }

  isLogged = (): boolean => {
    return this.getToken() !== undefined;
  }

  getUserId = (): string => {
    return this.getToken()?.properties.userId.toString();
  }
}
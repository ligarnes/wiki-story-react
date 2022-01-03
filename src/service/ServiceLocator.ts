import LoginService from "./user/LoginService";
import UserService from "./user/UserService";

export default interface ServiceLocator {
  readonly loginService: LoginService;
  readonly userService: UserService
}
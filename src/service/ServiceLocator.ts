import LoginService from "./user/LoginService";
import WikiService from "./WikiService";
import UserService from "./user/UserService";

export default interface ServiceLocator {
  readonly loginService: LoginService;
  readonly wikiService: WikiService;
  readonly userService: UserService
}
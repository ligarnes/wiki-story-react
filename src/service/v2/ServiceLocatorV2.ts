import WikiV2Service from "./WikiV2Service";
import ArticleV2Service from "./ArticleV2Service";
import UserService from "../user/UserService";
import LoginService from "../user/LoginService";

export default interface ServiceLocatorV2 {
  readonly loginService: LoginService;
  readonly userService: UserService;
  readonly wikiService: WikiV2Service;
  readonly articleService: ArticleV2Service;
}
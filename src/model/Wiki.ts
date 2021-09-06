import {getApplication} from "../Application";
import {Permission, PERMISSION_ADMIN, PERMISSION_READ} from "./Permission";

export function newDefaultWiki(): WikiMinimalCreate {
  const user = getApplication().serviceLocator.loginService.getUserId();

  const defaultPermissions: { [k: string]: any } = {};
  defaultPermissions["game_masters"] = PERMISSION_ADMIN;
  defaultPermissions["players"] = PERMISSION_READ;

  return {
    title: "",
    groupList: [
      {name: "game_masters", members: [user]},
      {name: "players", members: []},
    ],
    permissionList: [
      {group: true, entityId: "game_masters", permission: PERMISSION_ADMIN},
      {group: true, entityId: "players", permission: PERMISSION_READ}
    ],
    defaultPermissions: defaultPermissions
  };
}

export function getPlayer(wiki: WikiMinimal): Player {
  const userId = getApplication().serviceLocator.loginService.getUserId();
  const group = wiki.groupList.find(group => group.members.indexOf(userId) >= 0);

  return {userId: userId, groupId: group?.name}
}

export interface WikiMinimalCreate {
  title: string;
  groupList: Array<Group>;
  permissionList: Array<Permission>;
  defaultPermissions: Object;
}

export interface WikiMinimal {
  id: string;
  title: string;
  groupList: Array<Group>;
  permissionList: Array<Permission>;
  defaultPermissions: Object;
}

export interface Group {
  name: string;
  members: Array<string>;
  invitationKey?: string;
}

export interface WikiComplete extends WikiMinimal {
  pages: Array<DocumentDescription>;
}

export interface BaseDocument {
  permissionList: Array<Permission>;
}

export interface DocumentDescription extends BaseDocument {
  id: string;
  title: string;
  documentType: string;
  parentId?: string;
}

export interface Player {
  userId: string;
  groupId?: string;
}
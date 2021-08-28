import {v4 as uuidv4} from 'uuid';
import {getApplication} from "../Application";
import {Permission, PERMISSION_ADMIN, PERMISSION_READ, PERMISSION_WRITE} from "./Permission";

export function newDefaultWiki(): WikiMinimalCreate {
  const user = getApplication().serviceLocator.loginService.getUserId();
  const gm = uuidv4();
  const player = uuidv4();
  const viewer = uuidv4();

  const defaultPermissions: { [k: string]: any } = {};
  defaultPermissions[gm] = PERMISSION_ADMIN;
  defaultPermissions[player] = PERMISSION_READ;
  defaultPermissions[viewer] = PERMISSION_READ;

  return {
    title: "",
    groupList: [
      {groupId: gm, name: "Game Master", members: [user]},
      {groupId: player, name: "Players", members: []},
      {groupId: viewer, name: "Viewers", members: []}
    ],
    permissionList: [
      {group: false, entityId: user, permission: PERMISSION_ADMIN},
      {group: true, entityId: gm, permission: PERMISSION_WRITE},
      {group: true, entityId: player, permission: PERMISSION_READ},
      {group: true, entityId: viewer, permission: PERMISSION_READ}
    ],
    defaultPermissions: defaultPermissions
  };
}

export function getPlayer(wiki: WikiMinimal): Player {
  const userId = getApplication().serviceLocator.loginService.getUserId();
  const group = wiki.groupList.find(group => group.members.indexOf(userId));

  return {userId: userId, groupId: group?.groupId}
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
  groupId: string;
  name: string;
  members: Array<string>;
  invitationKey?: string;
}

export interface WikiComplete extends WikiMinimal {
  pages: Array<DocumentDescription>;
}

export interface Document {
  permissionList: Array<Permission>;
}

export interface DocumentDescription extends Document {
  id: string;
  title: string;
  documentType: string;
  parentId?: string;
}

export interface Player {
  userId: string;
  groupId?: string;
}
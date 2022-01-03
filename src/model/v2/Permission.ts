import {faEye, faLock, faLockOpen, faPen} from "@fortawesome/free-solid-svg-icons";
import {Permission, Player} from "./Wiki";

export const GM_GROUP = "game_masters";
export const PLAYERS_GROUP = "players";
export const VIEWER_GROUP = "viewers";

export type Role = 'admin' | 'writer' | 'reader' | 'none'

export function getRole(entityId: string, permission: Permission): Role {
  if (permission.admins.indexOf(entityId) >= 0) {
    return PERMISSION_ADMIN;
  } else if (permission.writes.indexOf(entityId) >= 0) {
    return PERMISSION_WRITE;
  } else if (permission.reads.indexOf(entityId) >= 0) {
    return PERMISSION_READ;
  }
  return PERMISSION_NONE;
}

export function getPlayerRole(player: Player, permission: Permission): Role {
  const roleId = getRole(player.userId, permission);
  const roleId2 = getRole(player.group, permission);

  if (roleId === PERMISSION_ADMIN || roleId2 === PERMISSION_ADMIN) {
    return PERMISSION_ADMIN;
  } else if (roleId === PERMISSION_WRITE || roleId2 === PERMISSION_WRITE) {
    return PERMISSION_WRITE;
  } else if (roleId === PERMISSION_READ || roleId2 === PERMISSION_READ) {
    return PERMISSION_READ;
  }
  return PERMISSION_NONE;
}

export const PERMISSION_NONE = 'none';
export const PERMISSION_ADMIN = 'admin';
export const PERMISSION_WRITE = 'writer';
export const PERMISSION_READ = 'reader';

export function getPermissionIcon(role: string) {
  switch (role) {
    case PERMISSION_ADMIN:
      return faLockOpen;
    case PERMISSION_WRITE:
      return faPen;
    case PERMISSION_READ:
      return faEye;
    default:
      return faLock;
  }
}
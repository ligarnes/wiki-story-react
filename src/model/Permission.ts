import {Document, Player} from "./Wiki";

export const PERMISSION_ADMIN = 0;
// Write can edit the document
export const PERMISSION_WRITE = 1;
// Read can view the document
export const PERMISSION_READ = 2;
// None, cannot access the document
export const PERMISSION_NONE = 3;

export interface Permission {
  group: boolean;
  entityId: string;
  permission: number;
}

export function canAdmin(player: Player, document: Document): boolean {
  return document.permissionList.filter(perm => accept(perm, PERMISSION_ADMIN))
    .find(perm => perm.entityId === player.userId || perm.entityId === player.groupId) !== undefined;
}

export function canEdit(player: Player, document: Document): boolean {
  return document.permissionList.filter(perm => accept(perm, PERMISSION_WRITE))
    .find(perm => perm.entityId === player.userId || perm.entityId === player.groupId) !== undefined;
}

export function canRead(player: Player, document: Document): boolean {
  return document.permissionList.filter(perm => accept(perm, PERMISSION_READ))
    .find(perm => perm.entityId === player.userId || perm.entityId === player.groupId) !== undefined;
}

function accept(permission: Permission, maxLevel: number) {
  return permission.permission <= maxLevel;
}
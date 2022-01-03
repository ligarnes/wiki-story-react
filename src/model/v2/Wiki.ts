import {UserProfile} from "../../service/user/UserService";

export function newWikiInfoCreate(user?: UserProfile): WikiInfoCreate {
  return {
    title: "New wiki",
    author: user?.userId,
    players: [{name: user?.username, group: "game_masters", userId: user?.userId}],
    permission: {
      admins: [user?.userId, "game_masters"],
      writes: [],
      reads: []
    },
    pages: []
  } as WikiInfoCreate;
}

export function emptyWikiInfoCreate(): WikiInfoCreate {
  return {
    title: "New wiki",
    author: "",
    players: [],
    permission: {
      admins: ["game_masters"],
      writes: [],
      reads: []
    },
    pages: []
  } as WikiInfoCreate;
}

export function emptyWikiInfo() {
  return {
    id: "",
    title: "",
    author: "",
    players: [],
    permission: {
      admins: [],
      writes: [],
      reads: []
    },
    pages: [],
    invitationLinks: []
  } as WikiInfo;
}

export function emptyPage(): DocumentDescription {
  return {
    documentId: "",
    documentType: "",
    title: "",
    permission: {
      admins: [],
      writes: [],
      reads: []
    }
  }
}

export function newArticle(parentId?: string): DocumentDescription {
  return {
    documentId: "",
    documentType: "article",
    title: "",
    parentId: parentId,
    permission: {
      admins: [],
      writes: [],
      reads: []
    }
  }
}

export function newFolder(parentId?: string): DocumentDescription {
  return {
    documentId: "",
    documentType: "folder",
    title: "",
    parentId: parentId,
    permission: {
      admins: [],
      writes: [],
      reads: []
    }
  }
}

export interface WikiInfo {
  id: string;
  title: string;
  author: string;
  players: Player[];
  permission: Permission;
  pages: DocumentDescription[];
  invitationLinks: InvitationLink[];
}

export interface WikiInfoCreate {
  title: string;
  author: string;
  players: Player[];
  permission: Permission;
  pages: DocumentDescription[];
}

export interface InvitationLink {
  group: string;
  validUntil: string;
  key: string;
}

export interface Player {
  userId: string;
  name: string;
  group: string;
}

export interface Permission {
  admins: string[];
  writes: string[];
  reads: string[];
}

export interface DocumentDescription {
  documentId: string;
  title: string;
  documentType: string;
  parentId?: string;
  permission: Permission;
}

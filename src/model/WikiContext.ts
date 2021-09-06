import {BaseDocument, DocumentDescription, getPlayer, Group, Player, WikiComplete} from "./Wiki";
import {WikiDocument} from "./Page";
import {getApplication} from "../Application";
import {
  canAdmin,
  canEdit,
  canRead,
  Permission,
  PERMISSION_ADMIN,
  PERMISSION_NONE,
  PERMISSION_READ,
  PERMISSION_WRITE
} from "./Permission";

function instanceOfBaseDocument(object: any): object is BaseDocument {
  return 'permissionList' in object;
}

function defaultWiki() {
  return {
    id: "",
    title: "Wiki",
    groupList: [],
    permissionList: [],
    pages: [],
    defaultPermissions: []
  } as WikiComplete;
}

export function emptyWikiContext(): WikiContext {
  const wiki = defaultWiki();
  return new WikiContext(wiki, undefined);
}

export async function loadWikiContext(wikiId: string, documentId: string | undefined = undefined): Promise<WikiContext> {
  const wikiPromise = getApplication().serviceLocator.wikiService.getWiki(wikiId);
  let document = undefined;
  if (documentId) {
    document = await getApplication().serviceLocator.wikiService.getArticle(wikiId, documentId);
  }
  return new WikiContext(await wikiPromise, document);
}

export class WikiContext {
  player: Player;
  wiki: WikiComplete;
  currentDocument: WikiDocument | undefined;
  gmGroup: Group;
  playerGroup: Group;

  constructor(wikiComplete: WikiComplete, currentDocument: WikiDocument | undefined) {
    this.player = getPlayer(wikiComplete);
    this.wiki = wikiComplete;
    this.currentDocument = currentDocument;
    this.gmGroup = wikiComplete.groupList.find(g => "game_masters" === g.name) || {name: "", members: []};
    this.playerGroup = wikiComplete.groupList.find(g => "players" === g.name) || {name: "", members: []};
  }

  getWiki() {
    return this.wiki;
  }

  getCurrentDocument() {
    return this.currentDocument;
  }

  isGM(): boolean {
    return this.player.groupId === "game_masters";
  }

  private reloadWiki(): Promise<WikiContext> {
    return new Promise<WikiContext>((resolve, reject) => {
      getApplication().serviceLocator.wikiService.getWiki(this.wiki.id)
        .then((document) => {
          resolve(new WikiContext(document, this.currentDocument));
        })
        .catch(err => {
          getApplication().notificationManager.errorNotification(["Failed to load the document", err.message])
          reject(err);
        });
    });
  }

  createDocument(wikiDocument: WikiDocument): Promise<WikiContext> {
    return getApplication().serviceLocator.wikiService.createDocument(wikiDocument)
      .then(() => this.reloadWiki());
  }

  updatePermissions(documentId: string, newTitle: string, permissionList: Array<Permission>): Promise<WikiContext> {
    const currentDocument = this.getDocumentById(documentId);
    return getApplication().serviceLocator.wikiService.updateDocument({
      ...currentDocument,
      wikiId: this.wiki.id,
      permissionList: permissionList
    } as WikiDocument)
      .then(() => this.reloadWiki());
  }

  moveDocument(fromId: string, toId: string): Promise<WikiContext> {
    const existing: DocumentDescription = this.getDocumentById(fromId);
    const target: DocumentDescription = this.getDocumentById(toId);
    let newParentId: string | undefined = toId;
    if (target.documentType !== "folder") {
      newParentId = target.parentId;
    }
    const updated: WikiDocument = {...existing, wikiId: this.wiki.id, parentId: newParentId} as WikiDocument;
    return getApplication().serviceLocator.wikiService.updateDocument(updated)
      .then(() => this.reloadWiki());
  }

  deleteDocument(documentId: string): Promise<WikiContext> {
    const document = this.getDocumentById(documentId);
    if (!this.isAdmin(document)) {
      getApplication().notificationManager.errorNotification(["Failed to delete the document", "Permission denied"]);
      throw new Error("Permission denied");
    }
    return getApplication().serviceLocator.wikiService.deleteDocument(this.wiki.id, documentId, document.documentType)
      .then(() => this.reloadWiki())
  }

  private getDocumentById(documentId: string): DocumentDescription {
    const document = this.wiki.pages.find(doc => doc.id === documentId);
    if (document) {
      return document;
    }
    throw new Error('The document with id does not exist');
  }

  public isAdmin(document: BaseDocument): boolean;
  public isAdmin(documentId: string): boolean;
  public isAdmin(doc: any): boolean {
    let document: BaseDocument;
    if (instanceOfBaseDocument(doc)) {
      document = doc;
    } else {
      document = this.getDocumentById(doc);
    }
    return canAdmin(this.player, document);
  }

  public canEdit(document: BaseDocument): boolean;
  public canEdit(documentId: string): boolean;
  public canEdit(doc: any) {
    let document: BaseDocument;
    if (instanceOfBaseDocument(doc)) {
      document = doc;
    } else {
      document = this.getDocumentById(doc);
    }
    return canEdit(this.player, document);
  }

  public canRead(document: BaseDocument): boolean;
  public canRead(documentId: string): boolean;
  public canRead(doc: any) {
    let document: BaseDocument;
    if (instanceOfBaseDocument(doc)) {
      document = doc;
    } else {
      document = this.getDocumentById(doc);
    }
    return canRead(this.player, document);
  }

  public getCurrentPermission(document: BaseDocument): number {
    if (this.isAdmin(document)) {
      return PERMISSION_ADMIN
    } else if (this.canEdit(document)) {
      return PERMISSION_WRITE;
    } else if (this.canRead(document)) {
      return PERMISSION_READ;
    }
    return PERMISSION_NONE;
  }

  public getPlayerPermission(document: BaseDocument): number {
    return document.permissionList.find(perm => perm.entityId === this.playerGroup.name)?.permission || PERMISSION_NONE;
  }

  public isPlayerAdmin(document: BaseDocument): boolean {
    return this.getPlayerPermission(document) === PERMISSION_ADMIN;
  }

  public isPlayerEditable(document: BaseDocument): boolean {
    return this.getPlayerPermission(document) === PERMISSION_WRITE;
  }

  public isPlayerVisible(document: BaseDocument): boolean {
    return this.getPlayerPermission(document) === PERMISSION_READ;
  }
}
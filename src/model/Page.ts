import {Permission, PERMISSION_NONE} from "./Permission";
import {WikiMinimal} from "./Wiki";
import {getApplication} from "../Application";
import {Content, ParagraphContent} from "./ArticleContent";

function getOrDefault(o: any, propertyName: string, defaultValue: number): number {
  return o[propertyName] !== undefined ? o[propertyName] : defaultValue;
}

function getDefaultPermissions(wikiInfo: WikiMinimal) {
  return wikiInfo.groupList.map(group => {
    const defaultPermission = getOrDefault(wikiInfo.defaultPermissions as any, group.name, PERMISSION_NONE);
    return {
      group: true,
      permission: defaultPermission,
      entityId: group.name,
    } as Permission;
  });
}

export function newDefaultArticle(wikiInfo: WikiMinimal, parentId: string | undefined) {
  return {
    title: "",
    documentType: "article",
    wikiId: wikiInfo.id,
    permissionList: getDefaultPermissions(wikiInfo),
    parentId: parentId,
    history: [newDefaultArticleHistory()],
    liked: []
  } as PageArticle
}

export function newDefaultArticleHistory() {
  return {
    metadata: {
      author: getApplication().serviceLocator.loginService.getUserId(),
      creationTime: Date.now(),
      version: 1
    },
    contentList: [{
      type: "ParagraphContent",
      text: "# New Great Article"
    } as ParagraphContent]
  };
}

export function newDefaultFolder(wikiInfo: WikiMinimal, parentId: string | undefined) {
  return {
    title: "",
    documentType: "folder",
    wikiId: wikiInfo.id,
    permissionList: getDefaultPermissions(wikiInfo),
    parentId: parentId
  } as Folder;
}

export function getLatestVersion(article: PageArticle) {
  const history = article.history;
  let data = history[0];
  let maxVersion = -1;
  for (let i = 0; i < history.length; i++) {
    if (history[i].metadata.version > maxVersion) {
      data = history[i];
      maxVersion = data.metadata.version;
    }
  }
  return data;
}

export interface WikiDocument {
  id?: string;
  wikiId: string;
  title: string;
  documentType: string;
  permissionList: Array<Permission>;
  parentId?: string;
}

export interface Folder extends WikiDocument {
}

export interface PageArticle extends WikiDocument {
  liked: Array<String>;
  history: Array<Article>;
}

export interface Article {
  metadata: Metadata;
  contentList: Array<Content>;
}

export interface Metadata {
  author: string;
  version: number;
  creationTime: number;
}

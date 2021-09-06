import {BackendQueryEngine} from "./QueryEngine";
import {Page} from "../model/Model";
import {WikiComplete, WikiMinimal, WikiMinimalCreate} from "../model/Wiki";
import {Article, PageArticle, WikiDocument} from "../model/Page";

export default class WikiService {
  private queryEngine: BackendQueryEngine;

  constructor(queryEngine: BackendQueryEngine) {
    this.queryEngine = queryEngine;
  }

  listWiki(page: number, pageSize: number = 10): Promise<Page<WikiMinimal>> {
    return this.queryEngine.get(`/wiki?page=${page}&pageSize=${pageSize}&full=false`).then(e => e as Page<WikiMinimal>);
  }

  createWiki(wiki: WikiMinimalCreate): Promise<unknown> {
    return this.queryEngine.patch("/wiki", wiki);
  }

  delete(wikiId: string): Promise<unknown> {
    return this.queryEngine.delete(`/wiki/${wikiId}`);
  }

  getArticle(wikiId: string, articleId: string): Promise<PageArticle> {
    return this.queryEngine.get(`/wiki/${wikiId}/page/${articleId}`).then(e => e as PageArticle);
  }

  generateInvitationLink(wikiId: string, groupId: string): Promise<unknown> {
    return this.queryEngine.post(`/wiki/${wikiId}/groupList/${groupId}/invitationKey`, "");
  }

  deleteInvitationLink(wikiId: string, groupId: string): Promise<unknown> {
    return this.queryEngine.delete(`/wiki/${wikiId}/groupList/${groupId}/invitationKey`);
  }

  joinInvitationLink(wikiId: string, invitationKey: string): Promise<unknown> {
    return this.queryEngine.post(`/wiki/${wikiId}/invitation/${invitationKey}`, "");
  }

  getWiki(wikiId: string): Promise<WikiComplete> {
    return this.queryEngine.get(`/wiki/${wikiId}?full=true`).then(e => {
      return e as WikiComplete;
    });
  }

  createDocument(document: WikiDocument): Promise<unknown> {
    return this.queryEngine.patch(`/wiki/${document.wikiId}/page`, document);
  }

  updateDocument(document: WikiDocument): Promise<unknown> {
    return this.queryEngine.put(`/wiki/${document.wikiId}/page/${document.id}`, document);
  }

  updateArticle(wikiId: string, documentId: string, newArticle: Article): Promise<PageArticle> {
    return this.queryEngine.patch(`/wiki/${wikiId}/page/${documentId}/history`, newArticle).then(e => {
      return e as PageArticle;
    });
  }

  editDocument(document: WikiDocument): Promise<unknown> {
    return this.queryEngine.patch(`/wiki/${document.wikiId}/page/${document.id}`, document);
  }

  deleteDocument(wikiId: string, documentId: string, documentType: string): Promise<unknown> {
    return this.queryEngine.delete(`/wiki/${wikiId}/page/${documentId}?type=${documentType}`);
  }
}
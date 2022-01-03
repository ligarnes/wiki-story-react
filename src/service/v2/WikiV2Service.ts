import {BackendQueryEngine} from "../QueryEngine";
import {DocumentDescription, WikiInfo, WikiInfoCreate} from "../../model/v2/Wiki";
import {Page} from "../../model/Model";

export default class WikiV2Service {
  private queryEngine: BackendQueryEngine;

  constructor(queryEngine: BackendQueryEngine) {
    this.queryEngine = queryEngine;
  }

  listWiki(page: number, pageSize: number = 10): Promise<Page<WikiInfo>> {
    return this.queryEngine.get(`/v2/wiki?page=${page}&pageSize=${pageSize}&full=false`).then(e => e as Page<WikiInfo>);
  }

  createWiki(wiki: WikiInfoCreate): Promise<unknown> {
    return this.queryEngine.patch("/v2/wiki", wiki);
  }

  delete(wikiId: string): Promise<unknown> {
    return this.queryEngine.delete(`/v2/wiki/${wikiId}`);
  }

  updateWiki(wikiInfo: WikiInfo): Promise<unknown> {
    return this.queryEngine.put(`/v2/wiki/${wikiInfo.id}`, wikiInfo);
  }

  generateInvitationLink(wikiId: string, groupId: string): Promise<unknown> {
    return this.queryEngine.post(`/v2/wiki/${wikiId}/groupList/${groupId}/invitationKey`, "");
  }

  deleteInvitationLink(wikiId: string, groupId: string): Promise<unknown> {
    return this.queryEngine.post(`/v2/wiki/${wikiId}/groupList/${groupId}/invitationKey`, "");
  }

  joinInvitationLink(wikiId: string, invitationKey: string): Promise<unknown> {
    return this.queryEngine.post(`/v2/wiki/${wikiId}/invitation/${invitationKey}`, "");
  }

  getWiki(wikiId: string): Promise<WikiInfo> {
    return this.queryEngine.get(`/v2/wiki/${wikiId}`).then(e => e as WikiInfo);
  }

  createDocument(wikiId: string, document: DocumentDescription): Promise<unknown> {
    return this.queryEngine.patch(`/v2/wiki/${wikiId}/pages`, document);
  }

  removeDocument(wikiId: string, documentId: string): Promise<unknown> {
    return this.queryEngine.delete(`/v2/wiki/${wikiId}/pages/${documentId}`);
  }

  updateDocument(wikiId: string, document: DocumentDescription): Promise<unknown> {
    return this.queryEngine.put(`/v2/wiki/${wikiId}/pages/${document.documentId}`, document);
  }

}
import {Article} from "../../model/v2/Article";
import {BackendQueryEngine} from "../QueryEngine";

export default class ArticleV2Service {
  private queryEngine: BackendQueryEngine;

  constructor(queryEngine: BackendQueryEngine) {
    this.queryEngine = queryEngine;
  }

  getArticle(wikiId: string, articleId: string): Promise<Article> {
    return this.queryEngine.get(`/v2/wiki/${wikiId}/page/${articleId}`).then((e: unknown) => e as Article);
  }

  updateArticle(wikiId: string, article: Article): Promise<unknown> {
    return this.queryEngine.patch(`/v2/wiki/${wikiId}/page/${article.documentId}`, article);
  }
}
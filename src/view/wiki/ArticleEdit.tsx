import React, {FunctionComponent, useEffect, useState} from "react";
import {Container} from "@material-ui/core";
import {Article, PageArticle} from "../../model/Page";
import {getApplication} from "../../Application";
import {RequestException} from "../../service/QueryEngine";
import {EditPageArticleComponent} from "../../component/wiki/pages/EditPageArticleComponent";


export interface Props {
  wikiId: string;
  articleId: string;
}

function defaultArticle(id: string): PageArticle {
  return {
    id: id,
    title: "",
    history: [
      {
        metadata: {author: "", version: 0, creationTime: 0},
        contentList: []
      } as Article
    ]
  } as PageArticle;
}

/**
 * The article page
 * @constructor
 */
export const ArticleEdit: FunctionComponent<Props> = (props: Props) => {

  const [article, setArticle] = useState(defaultArticle(props.articleId));
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getApplication().serviceLocator.wikiService.getArticle(props.wikiId, props.articleId)
      .then((article) => {
        setLoading(false);
        setArticle(article);
      })
      .catch((e: RequestException) => {
        setHasError(true)
        setLoading(false);
        getApplication().notificationManager.errorNotification(['Failed to retrieved the article', e.message]);
      });
  }, [props.wikiId, props.articleId]);

  return (
    <Container>
      {loading ? <div>Loading...</div> :
        hasError ? <div>Error occurred.</div> :
          <EditPageArticleComponent article={article} onSaved={(updated) => setArticle(updated)}/>}
    </Container>
  );
}

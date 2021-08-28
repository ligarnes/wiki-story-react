import React, {FunctionComponent, useEffect, useState} from "react";
import {Container} from "@material-ui/core";
import {PageArticleComponent} from "../../component/wiki/pages/PageArticleComponent";
import {Article, PageArticle} from "../../model/Page";
import {getApplication} from "../../Application";
import {RequestException} from "../../service/QueryEngine";


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
export const ArticleView: FunctionComponent<Props> = (props: Props) => {

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
          <PageArticleComponent article={article}/>}
    </Container>
  );
}

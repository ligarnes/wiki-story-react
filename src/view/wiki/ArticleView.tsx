import React, {FunctionComponent} from "react";
import {Container} from "@mui/material";
import {PageArticleComponent} from "../../component/wiki/pages/PageArticleComponent";


/**
 * The article page
 * @constructor
 */
export const ArticleView: FunctionComponent<unknown> = () => {
  return (
    <Container>
      <PageArticleComponent/>
    </Container>
  );
}

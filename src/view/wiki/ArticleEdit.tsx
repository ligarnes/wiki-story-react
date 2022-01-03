import React, {FunctionComponent} from "react";
import {Container} from "@mui/material";
import {EditPageArticleComponent} from "../../component/wiki/pages/EditPageArticleComponent";

/**
 * The article page
 * @constructor
 */
export const ArticleEdit: FunctionComponent<unknown> = () => {

  return (
    <Container>
      <EditPageArticleComponent/>
    </Container>
  );
}

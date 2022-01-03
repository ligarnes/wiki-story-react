import React, {FunctionComponent} from "react";
import {Box, Button, Grid, Typography} from "@mui/material";
import {ContentFactory} from "./content/ContentFactory";
import {Content} from "../../../model/ArticleContent";
import {useHistory} from "react-router";
import {useRecoilValue} from "recoil";
import {wikiIdAtom} from "../../../atom/WikiAtom";
import {articleAtom} from "../../../atom/ArticleAtom";

export const PageArticleComponent: FunctionComponent<unknown> = () => {
  const history = useHistory();

  const article = useRecoilValue(articleAtom);
  const wikiId = useRecoilValue(wikiIdAtom);

  const edit = () => {
    history.push(`/wiki/${wikiId}/article/${article.documentId}/edit`);
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mx={3} display="flex" alignItems="center">
            <Typography variant="h2" align="left" sx={{flexGrow: 1}}>{article.title}</Typography>
            <div>
              <Button variant="contained" color="primary" onClick={edit}>Edit</Button>
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            {article && article.sections.map((c: Content, idx: number) => (
              <ContentFactory key={`${article.documentId}-content-${idx}`} content={c}/>))
            }
          </Box>
        </Grid>
      </Grid>
    </>);
}

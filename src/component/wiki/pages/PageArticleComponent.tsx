import React, {FunctionComponent} from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
import {ContentFactory} from "./content/ContentFactory";
import {Article, getLatestVersion, PageArticle} from "../../../model/Page";
import {Content} from "../../../model/ArticleContent";
import {useHistory} from "react-router";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  }
}));

export interface Props {
  article: PageArticle;
}

export const PageArticleComponent: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const {article} = props;
  const data: Article = getLatestVersion(props.article);

  const edit = () => {
    history.push(`/wiki/${article.wikiId}/article/${article.id}/edit`);
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mx={3} display="flex" alignItems="center">
            <Typography variant="h2" align="left" className={classes.title}>{article.title}</Typography>
            <div>
              <Button variant="contained" color="primary" onClick={edit}>Edit</Button>
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            {data &&
            data.contentList.map((c: Content, idx: number) => (
              <ContentFactory key={`${article.id}-content-${idx}`} content={c}/>))
            }
          </Box>
        </Grid>
      </Grid>
    </>)
    ;
}

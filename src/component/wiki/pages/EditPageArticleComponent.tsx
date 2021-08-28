import React, {FunctionComponent, useEffect, useState} from "react";
import {Box, Button, ButtonGroup, Grid, Typography} from "@material-ui/core";
import {Article, getLatestVersion, PageArticle} from "../../../model/Page";
import {ContentEditor} from "./form/content/ContentEditor";
import {Content} from "../../../model/ArticleContent";
import {getApplication} from "../../../Application";
import {useHistory} from "react-router";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
  flexContainer: {
    display: "flex",
    alignItems: "center"
  }
}));

export interface Props {
  article: PageArticle;
  onSaved: (updated: PageArticle) => void;
}

export const EditPageArticleComponent: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();

  const {article} = props;
  const data: Article = getLatestVersion(props.article);

  const [currentChange, setCurrentChange] = useState({
    unsaved: false,
    contentList: []
  } as { unsaved: boolean, contentList: Array<Content> });
  useEffect(() => {
    setCurrentChange({unsaved: false, contentList: data.contentList});
  }, [article, data.contentList]);

  const beforeunload = (e: BeforeUnloadEvent) => {
    if (currentChange.unsaved) {
      e.preventDefault();
      e.returnValue = true;
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', beforeunload);

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
    }
  });

  const cancel = () => {
    history.push(`/wiki/${article.wikiId}/article/${article.id}`);
  }

  const onSave = () => {
    if (!currentChange.unsaved) {
      getApplication().notificationManager.successNotification(`Nothing to save`);
      return;
    }

    const newArticle = {
      metadata: {
        author: getApplication().serviceLocator.loginService.getUserId(),
        version: data.metadata.version + 1,
        creationTime: Date.now()
      },
      contentList: currentChange.contentList
    } as Article;
    if (article.id) {
      getApplication().serviceLocator.wikiService.updateArticle(article.wikiId, article.id, newArticle)
        .then(updated => {
          getApplication().notificationManager.successNotification(`Saved`);
          props.onSaved(updated);
        })
        .catch(err => getApplication().notificationManager.errorNotification(["Failed to update the article", err.message]));
    }
  }

  const onChange = (contents: Array<Content>) => {
    setCurrentChange({unsaved: true, contentList: contents});
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mx={3} className={classes.flexContainer}>
            <Typography variant="h2" align="left" className={classes.title}>{article.title}</Typography>
            <div>
              <ButtonGroup size="large" aria-label="small outlined button group">
                <Button variant="contained" color="primary" onClick={onSave}>Save</Button>
                <Button variant="contained" color="secondary" onClick={cancel}>Cancel</Button>
              </ButtonGroup>
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <ContentEditor contentList={currentChange.contentList} onChange={onChange}/>
          </Box>
        </Grid>
      </Grid>
    </>);
}

import React, {FunctionComponent, useEffect, useState} from "react";
import {Box, Button, ButtonGroup, Grid, Typography} from "@mui/material";
import {ContentEditor} from "./form/content/ContentEditor";
import {Content} from "../../../model/ArticleContent";
import {useHistory} from "react-router";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {wikiIdAtom} from "../../../atom/WikiAtom";
import {addNotificationSelector} from "../../../atom/NotificationAtom";
import {serviceLocatorAtom} from "../../../atom/ServiceLocatorAtom";
import {articleAtom} from "../../../atom/ArticleAtom";

export const EditPageArticleComponent: FunctionComponent<unknown> = () => {
  const history = useHistory();

  const [currentChange, setCurrentChange] = useState({
    unsaved: false,
    contentList: []
  } as { unsaved: boolean, contentList: Array<Content> });

  const [article, setArticle] = useRecoilState(articleAtom);
  const serviceLocator = useRecoilValue(serviceLocatorAtom);
  const addNotification = useSetRecoilState(addNotificationSelector);

  const wikiId = useRecoilValue(wikiIdAtom);

  useEffect(() => {
    setCurrentChange({unsaved: false, contentList: article.sections});
  }, [article, article.sections]);

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
    history.push(`/wiki/${wikiId}/article/${article.documentId}`);
  }

  const onSave = () => {
    if (!currentChange.unsaved) {
      addNotification({title: "Info", text: "Nothing to save", severity: "info"});
      return;
    }

    const updatedArticle = {...article};
    updatedArticle.version = updatedArticle.version + 1;
    updatedArticle.sections = currentChange.contentList;

    serviceLocator?.articleService.updateArticle(wikiId, updatedArticle)
      .then(() => {
        addNotification({title: "Saved", text: "Article updated", severity: "success"});
        setCurrentChange({unsaved: false, contentList: updatedArticle.sections})
        setArticle(updatedArticle);
      })
      .catch(() => addNotification({title: "Info", text: "Failed to update the article", severity: "error"}));
  }

  const onChange = (contents: Array<Content>) => {
    setCurrentChange({unsaved: true, contentList: contents});
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mx={3} sx={{
            display: "flex",
            alignItems: "center"
          }}>
            <Typography variant="h2" align="left" sx={{flexGrow: 1}}>{article.title}</Typography>
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

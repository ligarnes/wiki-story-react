import React, {FunctionComponent, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {SnackNotificationComponent} from "../../../component/SnackNotificationComponent";
import {getApplication} from "../../../Application";
import {DRAWER_WIDTH, DrawerComponent} from "../../../component/menu/DrawerComponent";
import {DocumentTree} from "../../../component/wiki/DocumentTree";
import {Box, ButtonGroup, Divider} from "@material-ui/core";
import {StyledButton} from "../../../component/generic/StyledButton";
import {EditDocumentDialog} from "../../../component/wiki/pages/form/EditDocumentDialog";
import {newDefaultArticle, newDefaultFolder, WikiDocument} from "../../../model/Page";
import {TopMenuWiki} from "../../../component/menu/TopMenuWiki";
import {emptyWikiContext, loadWikiContext} from "../../../model/WikiContext";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // Necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -DRAWER_WIDTH
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

export interface Props {
  wikiId: string;
  documentId?: string;
}

/**
 * The WikiMinimal layout component.
 * @param {React.PropsWithChildren<unknown>} props the properties of the component
 * @constructor
 */
export const WikiTemplateView: FunctionComponent<Props> = (props: React.PropsWithChildren<Props>) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const [wikiContext, setWikiContext] = useState(emptyWikiContext())

  const [loading, setLoading] = useState(true);

  const [editDocumentForm, setEditDocumentForm] = useState({
    open: false,
    document: newDefaultFolder(wikiContext.getWiki(), undefined)
  } as { open: boolean, document: WikiDocument })

  useEffect(() => {
    loadWikiContext(props.wikiId, props.documentId)
      .then(wikiCtx => {
        setWikiContext(wikiCtx)
        setLoading(false)
      })
      .catch(err => getApplication().notificationManager.errorNotification(`Failed to load the wiki ${err}`));
  }, [props.wikiId, props.documentId]);

  const newDocument = (document: WikiDocument) => {
    setEditDocumentForm({open: true, document: document});
  }

  const editDocument = (document: WikiDocument) => {
    setEditDocumentForm({open: true, document: document});
  }

  const deleteDocument = (documentId: string) => {
    wikiContext.deleteDocument(documentId)
      .then(wikiCtx => {
        setWikiContext(wikiCtx);
        getApplication().notificationManager.successNotification(`Document deleted`);
      })
      .catch(err => getApplication().notificationManager.errorNotification(["Failed to delete the document", err.message]));
  }

  const documentSubmitHandler = (document: WikiDocument) => {
    if (document.id) {
      wikiContext.updatePermissions(document.id, document.title, document.permissionList)
        .then(wikiCtx => {
          setWikiContext(wikiCtx);
          getApplication().notificationManager.successNotification(`Document ${document.title} created`);
        })
        .catch(err => getApplication().notificationManager.errorNotification(["Failed to update the folder", err.message]));
    } else {
      wikiContext.createDocument(document)
        .then(wikiCtx => {
          setWikiContext(wikiCtx);
          getApplication().notificationManager.successNotification(`Document ${document.title} created`);
        })
        .catch(err => getApplication().notificationManager.errorNotification(["Failed to create the folder", err.message]));
    }
    setEditDocumentForm({open: false, document: document})
  }

  const moveDocument = (fromId: string, toId: string) => {
    wikiContext.moveDocument(fromId, toId)
      .then(wikiCtx => {
        setWikiContext(wikiCtx);
        getApplication().notificationManager.successNotification(`Document is moved`);
      })
      .catch(err => getApplication().notificationManager.errorNotification(["Failed to move the document", err.message]));
  }

  return (
    <div className={classes.root}>
      <TopMenuWiki wikiMinimal={wikiContext.getWiki()} isDrawerOpen={open} handleDrawerOpen={() => setOpen(true)}/>
      <DrawerComponent isDrawerOpen={open} handleDrawerClose={() => setOpen(false)}>
        {loading ? <div>Loading...</div> :
          <>
            <Box display="flex" justifyContent="center" mx={2} mt={2}>
              <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                <StyledButton size="small" variant="contained" color="primary"
                              onClick={() => newDocument(newDefaultArticle(wikiContext.getWiki(), undefined))}>
                  New article
                </StyledButton>
                <StyledButton size="small" variant="contained"
                              onClick={() => newDocument(newDefaultFolder(wikiContext.getWiki(), undefined))}>
                  New folder
                </StyledButton>
              </ButtonGroup>
            </Box>
            <EditDocumentDialog open={editDocumentForm.open} submit={documentSubmitHandler}
                                cancel={() => setEditDocumentForm({open: false, document: editDocumentForm.document})}
                                wikiInfo={wikiContext.getWiki()} defaultDocument={editDocumentForm.document}/>
            <Box my={2}> <Divider variant="middle"/> </Box>
            <DocumentTree wikiInfo={wikiContext} selectedId={props.documentId}
                          onDocumentCreated={newDocument} onDocumentUpdated={editDocument}
                          onDocumentDeleted={deleteDocument} onDocumentMove={moveDocument}/>
          </>
        }
      </DrawerComponent>
      <main className={clsx(classes.content, {[classes.contentShift]: open})}>
        <div className={classes.drawerHeader}/>
        <div>
          {props.children}

          <SnackNotificationComponent notificationManager={getApplication().notificationManager}/>
        </div>
      </main>
    </div>
  );
}

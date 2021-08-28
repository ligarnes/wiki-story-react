import React, {FunctionComponent, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {SnackNotificationComponent} from "../../../component/SnackNotificationComponent";
import {getApplication} from "../../../Application";
import {DRAWER_WIDTH, DrawerComponent} from "../../../component/menu/DrawerComponent";
import {WikiComplete} from "../../../model/Wiki";
import {RequestException} from "../../../service/QueryEngine";
import {DocumentTree} from "../../../component/wiki/DocumentTree";
import {Box, ButtonGroup, Divider} from "@material-ui/core";
import {StyledButton} from "../../../component/generic/StyledButton";
import {EditDocumentDialog} from "../../../component/wiki/pages/form/EditDocumentDialog";
import {Folder, newDefaultArticle, newDefaultFolder, PageArticle, WikiDocument} from "../../../model/Page";
import {TopMenuWiki} from "../../../component/menu/TopMenuWiki";

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

function defaultWiki() {
  const wikiInfo: WikiComplete = {
    id: "",
    title: "Wiki",
    groupList: [],
    permissionList: [],
    pages: [],
    defaultPermissions: []
  } as WikiComplete;

  return wikiInfo;
}

/**
 * The WikiMinimal layout component.
 * @param {React.PropsWithChildren<unknown>} props the properties of the component
 * @constructor
 */
export const WikiTemplateView: FunctionComponent<Props> = (props: React.PropsWithChildren<Props>) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const [wiki, setWiki] = useState(defaultWiki());
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [editDocumentForm, setEditDocumentForm] = useState({
    open: false,
    document: newDefaultFolder(wiki, undefined)
  } as { open: boolean, document: WikiDocument })

  useEffect(() => {
    getApplication().serviceLocator.wikiService.getWiki(props.wikiId)
      .then((wiki) => {
        setLoading(false);
        setWiki(wiki);
      })
      .catch((e: RequestException) => {
        setHasError(true)
        setLoading(false);
        getApplication().notificationManager.errorNotification(['Failed to retrieved the article', e.message]);
      });
  }, [props.wikiId]);

  const newFolder = () => {
    setEditDocumentForm({
      open: true,
      document: newDefaultFolder(wiki, undefined)
    });
  }

  const newArticle = () => {
    setEditDocumentForm({
      open: true,
      document: newDefaultArticle(wiki, undefined)
    });
  }

  const createArticle = (article: PageArticle) => {
    getApplication().serviceLocator.wikiService.createDocument(article)
      .then(() => getApplication().notificationManager.successNotification(`Article ${article.title} created successfully`))
      .catch(err => getApplication().notificationManager.errorNotification(["Failed to create the article", err.message]));
  }

  const createFolder = (folder: Folder) => {
    getApplication().serviceLocator.wikiService.createDocument(folder)
      .then(r => getApplication().notificationManager.successNotification(`Folder ${folder.title} created successfully`))
      .catch(err => getApplication().notificationManager.errorNotification(["Failed to create the folder", err.message]));
  }


  const documentSubmitHandler = (document: WikiDocument) => {
    if (document.documentType === "article") {
      createArticle(document as PageArticle);
    } else if (document.documentType === "folder") {
      createFolder(document as Folder);
    }
  }

  return (
    <div className={classes.root}>
      <TopMenuWiki wikiMinimal={wiki} isDrawerOpen={open} handleDrawerOpen={() => setOpen(true)}/>
      <DrawerComponent isDrawerOpen={open} handleDrawerClose={() => setOpen(false)}>
        {loading ? <div>Loading...</div> :
          hasError ? <div>Failed to load the wiki documents.</div> :
            <>
              <Box display="flex" justifyContent="center" mx={2} mt={2}>
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                  <StyledButton size="small" variant="contained" color="primary" onClick={newArticle}>
                    New article
                  </StyledButton>
                  <StyledButton size="small" variant="contained" onClick={newFolder}>New folder</StyledButton>
                </ButtonGroup>
              </Box>
              <EditDocumentDialog open={editDocumentForm.open} submit={documentSubmitHandler}
                                  cancel={() => setEditDocumentForm({open: false, document: editDocumentForm.document})}
                                  wikiInfo={wiki} defaultDocument={editDocumentForm.document}/>
              <Box my={2}> <Divider variant="middle"/> </Box>
              <DocumentTree wikiInfo={wiki} selectedId={props.documentId}/>
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

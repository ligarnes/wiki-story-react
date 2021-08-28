import React, {FunctionComponent, useEffect, useState} from "react";
import {Document, DocumentDescription, WikiComplete} from "../../model/Wiki";
import {TreeView} from "@material-ui/lab";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {Option, StyledTreeItem} from "./pages/StyledTreeItem";
import {useHistory} from "react-router";
import {EditDocumentDialog} from "./pages/form/EditDocumentDialog";
import {Folder, newDefaultArticle, newDefaultFolder, PageArticle, WikiDocument} from "../../model/Page";
import {faFile, faFolder} from "@fortawesome/free-solid-svg-icons";
import {getApplication} from "../../Application";
import theme from "../../theme/theme";

export interface Props {
  wikiInfo: WikiComplete;
  selectedId?: string;
}

export interface DocumentInfo extends Document {
  id: string;
  title: string;
  documentType: string;
  children: Array<DocumentInfo>;
}

interface RecursiveTreeItem {
  document: DocumentDescription;
  subItems: Array<RecursiveTreeItem>;
}

function getChildren(items: Array<DocumentDescription>, parentId: string): Array<DocumentInfo> {
  const children: Array<DocumentInfo> = [];

  items.forEach(document => {
    if (document.parentId === parentId) {
      children.push({
        id: document.id,
        documentType: document.documentType,
        title: document.title,
        permissionList: document.permissionList,
        children: getChildren(items, document.id)
      });
    }
  });

  return children;
}

function convertToTree(items: Array<DocumentDescription>): Array<DocumentInfo> {

  const sortedTree: Array<DocumentInfo> = [];

  // Root folders
  items.forEach(document => {
    if (!document.parentId) {
      sortedTree.push({
        id: document.id,
        documentType: document.documentType,
        title: document.title,
        permissionList: document.permissionList,
        children: getChildren(items, document.id)
      });
    }
  });

  return sortedTree;
}

function getParents(items: Array<DocumentDescription>, selectedId?: string): Array<string> {
  const selected = items.find((doc) => doc.id === selectedId);

  if (selected && selected.parentId) {
    return [selected.parentId, ...getParents(items, selected.parentId)];
  }
  return [];
}

/**
 * The WikiDocument tree component.
 * @param {React.PropsWithChildren<unknown>} props the properties of the component
 * @constructor
 */
export const DocumentTree: FunctionComponent<Props> = (props: React.PropsWithChildren<Props>) => {
  const history = useHistory();

  const {wikiInfo, selectedId} = props;

  const [editDocumentForm, setEditDocumentForm] = useState({
    open: false,
    document: newDefaultFolder(wikiInfo, undefined)
  } as { open: boolean, document: WikiDocument })

  const [expanded, setExpanded] = useState(new Array<string>());
  useEffect(() => {
    setExpanded(getParents(wikiInfo.pages, selectedId));
  }, [selectedId, wikiInfo.pages]);

  const pages = convertToTree(wikiInfo.pages);

  const convertDocument = (document: DocumentInfo): RecursiveTreeItem => {
    return {
      id: document.id,
      document: document,
      subItems: document.children.map(convertDocument)
    } as RecursiveTreeItem;
  };

  const items: Array<RecursiveTreeItem> = pages.map(doc => convertDocument(doc));

  const getItemActions = (item: RecursiveTreeItem): Array<Option> => {
    const isFolder = item.document.documentType === "folder";
    if (isFolder) {
      return [
        {
          title: "New Folder", onClick: () => {
            setEditDocumentForm({
              open: true,
              document: newDefaultFolder(wikiInfo, item.document.id)
            });
          }
        },
        {
          title: "New article", onClick: () => {
            setEditDocumentForm({
              open: true,
              document: newDefaultArticle(wikiInfo, item.document.id)
            });
          }
        },
        {
          title: "Edit Folder", onClick: () => {
            setEditDocumentForm({
              open: true,
              document: {
                ...item.document,
                wikiId: wikiInfo.id,
              } as WikiDocument
            });
          }
        },
        {
          title: "Delete document", onClick: () => {
            getApplication().serviceLocator.wikiService
              .deleteDocument(wikiInfo.id, item.document.id, "folder")
              .then(r => getApplication().notificationManager.successNotification(`Folder ${item.document.title} was deleted`))
              .catch(err => getApplication().notificationManager.errorNotification(["Failed to delete the document", err.message]));
          }
        }];
    }
    return [{title: "Edit permissions"},
      {title: "Delete article"}];
  }
  const convertItem = (item: RecursiveTreeItem) => {
    let onClick;
    const isFolder = item.document.documentType === "folder";
    const icon = isFolder ? faFolder : faFile;
    if (!isFolder) {
      onClick = () => {
        const link: string = `/wiki/${wikiInfo.id}/article/${item.document.id}`;
        history.push(link);
      }
    }
    const actions = getItemActions(item);
    const color = theme.palette.primary.main;
    const bgColor = '#aed581';

    return (
      <StyledTreeItem key={item.document.id} nodeId={item.document.id} labelText={item.document.title}
                      labelIcon={icon} color={color} bgColor={bgColor} onLabelClick={onClick} options={actions}>
        {item.subItems.map(convertItem)}
      </StyledTreeItem>
    );
  }

  const createArticle = (article: PageArticle) => {
    getApplication().serviceLocator.wikiService.createDocument(article)
      .then(r => getApplication().notificationManager.successNotification(`Article ${article.title} created successfully`))
      .catch(err => getApplication().notificationManager.errorNotification(["Failed to create the article", err.message]));
  }

  const editArticle = (article: PageArticle) => {

  }

  const createFolder = (folder: Folder) => {
    getApplication().serviceLocator.wikiService.createDocument(folder)
      .then(r => getApplication().notificationManager.successNotification(`Folder ${folder.title} created successfully`))
      .catch(err => getApplication().notificationManager.errorNotification(["Failed to create the document", err.message]));
  }

  const editFolder = (folder: Folder) => {
    getApplication().serviceLocator.wikiService.editDocument(folder)
      .then(r => getApplication().notificationManager.successNotification(`Folder ${folder.title} created successfully`))
      .catch(err => getApplication().notificationManager.errorNotification(["Failed to create the document", err.message]));
  }

  const documentSubmitHandler = (document: WikiDocument) => {
    if (document.documentType === "article") {
      if (document.id) {
        editArticle(document as PageArticle);
      } else {
        createArticle(document as PageArticle);
      }
    } else if (document.documentType === "folder") {
      if (document.id) {
        editFolder(document as Folder);
      } else {
        createFolder(document as Folder);
      }
    }
  }

  if (editDocumentForm.open) {
    console.log(editDocumentForm)
  }

  return (
    <>
      <TreeView defaultCollapseIcon={<ArrowDropDownIcon/>}
                defaultExpandIcon={<ArrowRightIcon/>}
                defaultEndIcon={<div style={{width: 24}}/>}
                expanded={expanded}
                selected={selectedId}
                onNodeToggle={(event: object, nodeIds: Array<string>) => {
                  setExpanded(nodeIds);
                }}>

        {items.map(convertItem)}
      </TreeView>
      <EditDocumentDialog open={editDocumentForm.open} submit={documentSubmitHandler}
                          cancel={() => setEditDocumentForm({open: false, document: editDocumentForm.document})}
                          wikiInfo={wikiInfo} defaultDocument={editDocumentForm.document}/>
    </>
  );
}

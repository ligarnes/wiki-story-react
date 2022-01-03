import React, {DragEvent, FunctionComponent, useEffect, useState} from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {useHistory} from "react-router";
import {faFile, faFolder, faFolderOpen} from "@fortawesome/free-solid-svg-icons";
import theme from "../../../theme/theme";
import {Box, Divider} from "@mui/material";
import {TreeView} from "@mui/lab";
import {DocumentTreeLegend} from "./DocumentTreeLegend";
import {useRecoilValue} from "recoil";
import {currentPlayerSelector, wikiIdAtom} from "../../../atom/WikiAtom";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {DocumentDescription, newArticle, newFolder, Permission} from "../../../model/v2/Wiki";
import {articleIdAtom} from "../../../atom/ArticleAtom";
import {getPermissionIcon, getPlayerRole, getRole, GM_GROUP, PLAYERS_GROUP} from "../../../model/v2/Permission";
import {orange} from "@mui/material/colors";
import {DocumentTreeItem, Option} from "../pages/DocumentTreeItem";

export interface Props {
  documents: DocumentDescription[];

  onDocumentCreated: (document: DocumentDescription) => void;
  onDocumentUpdated: (document: DocumentDescription) => void;
  onDocumentDeleted: (documentId: string) => void;
  onDocumentMove: (fromId: string, toId: string) => void;
}

export interface DocumentInfo {
  id: string;
  title: string;
  documentType: string;
  parentId?: string;
  children: Array<DocumentInfo>;
  permission: Permission;
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
        id: document.documentId,
        documentType: document.documentType,
        title: document.title,
        parentId: document.parentId,
        permission: document.permission,
        children: getChildren(items, document.documentId)
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
        id: document.documentId,
        documentType: document.documentType,
        title: document.title,
        parentId: document.parentId,
        permission: document.permission,
        children: getChildren(items, document.documentId)
      });
    }
  });

  return sortedTree;
}

function getParents(items: Array<DocumentDescription>, selectedId?: string): Array<string> {
  const selected = items.find((doc) => doc.documentId === selectedId);

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
  const {documents} = props;

  const selectedId = useRecoilValue(articleIdAtom);
  const selectedItemId = selectedId ? selectedId : "home";

  const [expanded, setExpanded] = useState([] as string[]);
  useEffect(() => {
    setExpanded(getParents(documents, selectedId));
  }, [selectedId, documents]);

  const wikiId = useRecoilValue(wikiIdAtom);
  const currentPlayer = useRecoilValue(currentPlayerSelector);

  const pages = convertToTree(documents);

  const convertDocument = (document: DocumentInfo): RecursiveTreeItem => {
    return {
      document: {
        documentId: document.id,
        parentId: document.parentId,
        documentType: document.documentType,
        title: document.title,
        permission: document.permission
      },
      subItems: document.children.map(convertDocument)
    } as RecursiveTreeItem;
  };

  const items: Array<RecursiveTreeItem> = pages.map(doc => convertDocument(doc));

  const getItemActions = (item: RecursiveTreeItem): Array<Option> => {
    const isFolder = item.document.documentType === "folder";
    if (isFolder) {
      return [
        {title: "New Folder", onClick: () => props.onDocumentCreated(newFolder(item.document.documentId))},
        {title: "New article", onClick: () => props.onDocumentCreated(newArticle(item.document.documentId))},
        {
          title: "Edit folder",
          onClick: () => props.onDocumentUpdated({...item.document, wikiId: wikiId,} as DocumentDescription)
        },
        {title: "Delete folder", onClick: () => props.onDocumentDeleted(item.document.documentId)}];
    }
    return [{
      title: "Edit permissions",
      onClick: () => props.onDocumentUpdated({...item.document, wikiId: wikiId} as DocumentDescription)
    }, {title: "Delete article", onClick: () => props.onDocumentDeleted(item.document.documentId)}];
  }

  const [dragItemId, setDragItemId] = useState("");
  const [dragOverId, setDragOverId] = useState("" as string | undefined);

  const convertItem = (item: RecursiveTreeItem) => {
    let onClick;
    const isFolder = item.document.documentType === "folder";
    const folderIcon = selectedItemId === item.document.documentId ? faFolderOpen : faFolder;
    const icon = isFolder ? folderIcon : faFile;
    if (!isFolder) {
      onClick = () => {
        const link: string = `/wiki/${wikiId}/article/${item.document.documentId}`;
        history.push(link);
      }
    }
    const actions = getItemActions(item);
    const color = theme.palette.primary.main;
    const bgColor = '#aed581';

    const onItemDragOver = () => {
      const targetDoc = item.document.documentType === "folder" ? item.document.documentId : item.document.parentId;
      console.log("Drag is over: ", targetDoc);
      if (dragOverId !== targetDoc) {
        setDragOverId(targetDoc);
      }
    };

    const onItemDragEnd = (evt: DragEvent) => {
      evt.preventDefault();
      if (dragOverId) {
        console.log("Drag over: ", dragOverId);
        props.onDocumentMove(dragItemId, dragOverId);
      }
    };

    const onItemDrag = () => {
      console.log("Drag: ", item.document.documentId);
      setDragItemId(item.document.documentId);
    }

    const currentRole = getPlayerRole(currentPlayer, item.document.permission);
    const icons: Array<{ icon: IconProp, color?: string, tooltip: string }> =
      [{
        icon: getPermissionIcon(currentRole),
        tooltip: "Your permission"
      }];
    if (currentPlayer.group === GM_GROUP) {
      const playerRole = getRole(PLAYERS_GROUP, item.document.permission);
      icons.push({
        icon: getPermissionIcon(playerRole),
        color: orange[400],
        tooltip: "Players permission"
      });
    }

    return (
      <DocumentTreeItem key={item.document.documentId} nodeId={item.document.documentId} labelText={item.document.title}
                        onDrag={onItemDrag} onDragEnd={onItemDragEnd} onDragOver={onItemDragOver} draggable={true}
                        labelIcon={icon} icons={icons}
                        color={color} bgColor={bgColor} onLabelClick={onClick} options={actions}>
        {item.subItems.map(convertItem)}
      </DocumentTreeItem>
    );
  }

  return (
    <>
      <TreeView defaultCollapseIcon={<ArrowDropDownIcon/>} defaultExpandIcon={<ArrowRightIcon/>}
                defaultEndIcon={<div style={{width: 24}}/>} expanded={expanded} selected={selectedItemId}
                onNodeToggle={(event: object, nodeIds: Array<string>) => {
                  setExpanded(nodeIds);
                }}>

        {items.map(convertItem)}
      </TreeView>
      <Box my={2}> <Divider variant="middle"/> </Box>
      <Box mx={2}> <DocumentTreeLegend/> </Box>
      <Box my={2}> <Divider variant="middle"/> </Box>
    </>
  );
}

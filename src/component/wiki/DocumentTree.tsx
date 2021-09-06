import React, {DragEvent, FunctionComponent, useEffect, useState} from "react";
import {BaseDocument, DocumentDescription} from "../../model/Wiki";
import {TreeView} from "@material-ui/lab";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {Option, StyledTreeItem} from "./pages/StyledTreeItem";
import {useHistory} from "react-router";
import {newDefaultArticle, newDefaultFolder, WikiDocument} from "../../model/Page";
import {faFile, faFolder} from "@fortawesome/free-solid-svg-icons";
import theme from "../../theme/theme";
import {WikiContext} from "../../model/WikiContext";
import {getPermissionIcon} from "../../model/Permission";
import {Box, Divider} from "@material-ui/core";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {orange} from "@material-ui/core/colors";
import {DocumentTreeLegend} from "./DocumentTreeLegend";

export interface Props {
  wikiInfo: WikiContext;
  selectedId?: string;

  onDocumentCreated: (document: WikiDocument) => void;
  onDocumentUpdated: (document: WikiDocument) => void;
  onDocumentDeleted: (documentId: string) => void;
  onDocumentMove: (fromId: string, toId: string) => void;
}

export interface DocumentInfo extends BaseDocument {
  id: string;
  title: string;
  documentType: string;
  parentId?: string;
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
        parentId: document.parentId,
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
        parentId: document.parentId,
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
  const wiki = wikiInfo.getWiki();

  const [expanded, setExpanded] = useState(new Array<string>());
  useEffect(() => {
    setExpanded(getParents(wikiInfo.getWiki().pages, selectedId));
  }, [selectedId, wikiInfo]);

  const pages = convertToTree(wikiInfo.getWiki().pages);

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
        {title: "New Folder", onClick: () => props.onDocumentCreated(newDefaultFolder(wiki, item.document.id))},
        {title: "New article", onClick: () => props.onDocumentCreated(newDefaultArticle(wiki, item.document.id))},
        {
          title: "Edit folder",
          onClick: () => props.onDocumentUpdated({...item.document, wikiId: wiki.id,} as WikiDocument)
        },
        {title: "Delete folder", onClick: () => props.onDocumentDeleted(item.document.id)}];
    }
    return [{
      title: "Edit permissions",
      onClick: () => props.onDocumentUpdated({...item.document, wikiId: wiki.id} as WikiDocument)
    }, {title: "Delete article", onClick: () => props.onDocumentDeleted(item.document.id)}];
  }

  const [dragItemId, setDragItemId] = useState("");
  const [dragOverId, setDragOverId] = useState("" as string | undefined);

  const convertItem = (item: RecursiveTreeItem) => {
    let onClick;
    const isFolder = item.document.documentType === "folder";
    const icon = isFolder ? faFolder : faFile;
    if (!isFolder) {
      onClick = () => {
        const link: string = `/wiki/${wiki.id}/article/${item.document.id}`;
        history.push(link);
      }
    }
    const actions = getItemActions(item);
    const color = theme.palette.primary.main;
    const bgColor = '#aed581';

    const onItemDragOver = () => {
      const targetDoc = item.document.documentType === "folder" ? item.document.id : item.document.parentId;
      if (dragOverId !== targetDoc) {
        setDragOverId(targetDoc);
      }
    };

    const onItemDragEnd = (evt: DragEvent) => {
      evt.preventDefault();
      if (dragOverId) {
        props.onDocumentMove(dragItemId, dragOverId);
      }
    };

    const onItemDrag = () => {
      setDragItemId(item.document.id);
    }

    const icons: Array<{ icon: IconProp, color?: string, tooltip: string }> =
      [{icon: getPermissionIcon(wikiInfo.getCurrentPermission(item.document)), tooltip: "Your permission"}];
    if (wikiInfo.isGM()) {
      icons.push({
        icon: getPermissionIcon(wikiInfo.getPlayerPermission(item.document)),
        color: orange[400],
        tooltip: "Players permission"
      });
    }

    return (
      <StyledTreeItem key={item.document.id} nodeId={item.document.id} labelText={item.document.title}
                      onDrag={onItemDrag} onDragEnd={onItemDragEnd} onDragOver={onItemDragOver} draggable={true}
                      labelIcon={icon} icons={icons}
                      color={color} bgColor={bgColor} onLabelClick={onClick} options={actions}>
        {item.subItems.map(convertItem)}
      </StyledTreeItem>
    );
  }

  return (
    <>
      <TreeView defaultCollapseIcon={<ArrowDropDownIcon/>} defaultExpandIcon={<ArrowRightIcon/>}
                defaultEndIcon={<div style={{width: 24}}/>} expanded={expanded} selected={selectedId}
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

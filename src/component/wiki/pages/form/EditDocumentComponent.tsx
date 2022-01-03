import React, {FunctionComponent} from "react";
import {Box, TextField} from "@mui/material";
import {EditPermissionComponent, Entity} from "./EditPermissionComponent";
import {groupsSelector, wikiAtom} from "../../../../atom/WikiAtom";
import {useRecoilValue} from "recoil";
import {DocumentDescription, Permission} from "../../../../model/v2/Wiki";


export interface Props {
  document: DocumentDescription;
  onChange: (folder: DocumentDescription) => void;
}

export const EditDocumentComponent: FunctionComponent<Props> = (props: Props) => {
  const {document} = props;

  const wiki = useRecoilValue(wikiAtom);

  const onChange = (evt: { target: { value: string; }; }) => {
    const newTitle = evt.target.value;
    const newDocument = {
      ...document,
      title: newTitle
    } as DocumentDescription;
    props.onChange(newDocument);
  }

  const onPermissionChange = (permission: Permission) => {
    const newFolder = {
      ...document,
      title: document.title,
      permission: permission
    } as DocumentDescription;
    props.onChange(newFolder);
  }

  const groups = useRecoilValue(groupsSelector);

  const entities: Entity[] = groups.map(g => {
    return {
      id: g.name,
      name: g.name
    }
  });

  entities.push(...wiki.players.map(p => {
    return {
      id: p.userId,
      name: p.name
    }
  }));

  let uniqueEntities = new Set<Entity>(entities);

  return (
    <>
      <Box>
        <TextField id="folderId" label="Title" variant="outlined" value={document.title} onChange={onChange}/>
        <EditPermissionComponent permission={document.permission} entities={Array.from(uniqueEntities.values())}
                                 onChange={onPermissionChange}/>
      </Box>
    </>);
}

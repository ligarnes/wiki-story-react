import React, {FunctionComponent, useEffect, useState} from "react";
import {WikiDocument} from "../../../../model/Page";
import {Box, TextField} from "@material-ui/core";
import {EditPermissionComponent} from "./EditPermissionComponent";
import {Permission} from "../../../../model/Permission";
import {WikiMinimal} from "../../../../model/Wiki";


export interface Props {
  wikiInfo: WikiMinimal;
  document: WikiDocument;
  onChange: (folder: WikiDocument) => void;
}

export const EditDocumentComponent: FunctionComponent<Props> = (props: Props) => {
  const {wikiInfo, document} = props;

  const [title, setTitle] = useState("");
  useEffect(() => {
    setTitle(props.document.title);
  }, [props.document.title]);

  const onChange = (evt: { target: { value: string; }; }) => {
    const newTitle = evt.target.value;
    setTitle(newTitle);
    const newDocument = {
      ...document,
      title: newTitle,
      wikiId: wikiInfo.id
    } as WikiDocument;
    props.onChange(newDocument);
  }

  const onPermissionChange = (permissionList: Array<Permission>) => {
    const newFolder = {
      ...document,
      title: title,
      permissionList: permissionList,
      wikiId: wikiInfo.id,
    } as WikiDocument;
    props.onChange(newFolder);
  }

  return (
    <>
      <Box>
        <TextField id="folderId" label="Title" variant="outlined" value={title} onChange={onChange}/>
        <EditPermissionComponent wikiInfo={wikiInfo} permissionList={document.permissionList}
                                 onChange={onPermissionChange}/>
      </Box>
    </>);
}

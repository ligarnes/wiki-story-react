import React, {FunctionComponent, useEffect, useState} from "react";
import {EditDocumentComponent} from "./EditDocumentComponent";
import FormDialog from "../../../generic/FormDialog";
import {Folder, WikiDocument} from "../../../../model/Page";
import {WikiMinimal} from "../../../../model/Wiki";


export interface Props {
  wikiInfo: WikiMinimal;
  defaultDocument: WikiDocument;
  open: boolean;
  submit: (document: WikiDocument) => void;
  cancel: () => void;
}

export const EditDocumentDialog: FunctionComponent<Props> = (props: Props) => {

  const [document, setDocument] = useState({
    id: "",
    title: "",
    documentType: "",
    wikiId: "",
    permissionList: []
  } as WikiDocument);

  useEffect(() => setDocument(props.defaultDocument), [props.defaultDocument]);

  const onChange = (newDocument: Folder) => {
    setDocument(newDocument);
  }

  let title = "Create a new " + props.defaultDocument.documentType;
  let primary = "Create";
  if (props.defaultDocument.id && props.defaultDocument.id.length > 0) {
    title = "Edit a " + props.defaultDocument.documentType;
    primary = "Edit";
  }

  return (
    <>
      <FormDialog open={props.open} title={title} createHandler={() => props.submit(document)}
                  cancelHandler={props.cancel} primaryLabel={primary}>
        <EditDocumentComponent wikiInfo={props.wikiInfo} document={document} onChange={onChange}/>
      </FormDialog>
    </>);
}

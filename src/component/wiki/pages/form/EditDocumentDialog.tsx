import React, {FunctionComponent, useEffect, useState} from "react";
import {EditDocumentComponent} from "./EditDocumentComponent";
import FormDialog from "../../../generic/FormDialog";
import {DocumentDescription} from "../../../../model/v2/Wiki";

export interface Props {
  defaultDocument: DocumentDescription;
  open: boolean;
  submit: (document: DocumentDescription) => void;
  cancel: () => void;
}

export const EditDocumentDialog: FunctionComponent<Props> = (props: Props) => {

  const [document, setDocument] = useState({
    documentId: "",
    title: "",
    documentType: "",
    permission: {
      admins: [],
      writes: [],
      reads: []
    }
  } as DocumentDescription);

  useEffect(() => setDocument(props.defaultDocument), [props.defaultDocument]);

  const onChange = (newDocument: DocumentDescription) => {
    setDocument(newDocument);
  }

  let title = "Create a new " + props.defaultDocument.documentType;
  let primary = "Create";
  if (props.defaultDocument.documentId && props.defaultDocument.documentId.length > 0) {
    title = "Edit a " + props.defaultDocument.documentType;
    primary = "Edit";
  }

  return (
    <>
      <FormDialog open={props.open} title={title} createHandler={() => props.submit(document)}
                  cancelHandler={props.cancel} primaryLabel={primary}>
        <EditDocumentComponent document={document} onChange={onChange}/>
      </FormDialog>
    </>);
}

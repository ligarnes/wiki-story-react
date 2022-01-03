import React, {FunctionComponent, useState} from "react";
import {DocumentTree} from "../../component/wiki/sidebar/DocumentTree";
import {Box, ButtonGroup, Divider} from "@mui/material";
import {StyledButton} from "../../component/generic/StyledButton";
import {EditDocumentDialog} from "../../component/wiki/pages/form/EditDocumentDialog";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {wikiAtom, wikiNeedRefreshAtom} from "../../atom/WikiAtom";
import {DocumentDescription, emptyPage, newArticle, newFolder} from "../../model/v2/Wiki";
import {serviceLocatorAtom} from "../../atom/ServiceLocatorAtom";
import {addNotificationSelector} from "../../atom/NotificationAtom";

/**
 * The Wiki drawer layout component.
 * @constructor
 */
export const WikiDrawer: FunctionComponent<unknown> = () => {

  const wiki = useRecoilValue(wikiAtom);

  const addNotification = useSetRecoilState(addNotificationSelector);
  const setWikiNeedRefresh = useSetRecoilState(wikiNeedRefreshAtom);

  const serviceLocator = useRecoilValue(serviceLocatorAtom);

  const [editDocumentForm, setEditDocumentForm] = useState({open: false, document: emptyPage()});

  const newDocument = (document: DocumentDescription) => {
    setEditDocumentForm({open: true, document: document});
  }

  const editDocument = (document: DocumentDescription) => {
    setEditDocumentForm({open: true, document: document});
  }

  const deleteDocument = (documentId: string) => {
    serviceLocator?.wikiService.removeDocument(wiki.id, documentId)
      .then(() => {
        setWikiNeedRefresh(true);
        addNotification({severity: "success", title: "Success", text: "Document deleted"});
      })
      .catch(() => addNotification({severity: "error", title: "Error", text: "Failed to delete the document"}));
  }

  const documentSubmitHandler = (document: DocumentDescription) => {
    if (document.documentId) {
      // update the existing
      serviceLocator?.wikiService.updateDocument(wiki.id, document)
        .then(() => {
          setWikiNeedRefresh(true);
          addNotification({severity: "success", title: "Success", text: `Document ${document.title} updated`})
        })
        .catch(() => addNotification({severity: "error", title: "Error", text: "Failed to create the document"}));
    } else {
      serviceLocator?.wikiService.createDocument(wiki.id, document)
        .then(() => {
          setWikiNeedRefresh(true);
          addNotification({severity: "success", title: "Success", text: `Document ${document.title} created`});
        })
        .catch(() => addNotification({severity: "error", title: "Error", text: "Failed to create the document"}));
    }
    setEditDocumentForm({open: false, document: document})
  }

  const moveDocument = (movedId: string, newParentId: string) => {
    const docSource = wiki.pages.find((page) => page.documentId === movedId);
    if (docSource) {
      const updatedDoc = {...docSource, parentId: newParentId};
      serviceLocator?.wikiService.updateDocument(wiki.id, updatedDoc)
        .then(() => {
          setWikiNeedRefresh(true);
          addNotification({severity: "success", title: "Success", text: `Document ${docSource.title} moved`});
        })
        .catch(() => addNotification({severity: "error", title: "Error", text: "Failed to move the document"}));
    } else {
      addNotification({severity: "error", title: "Error", text: "Failed to move the document"})
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="center" mx={2} mt={2}>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <StyledButton size="small" variant="contained" color="primary" onClick={() => newDocument(newArticle())}>
            New article
          </StyledButton>
          <StyledButton size="small" variant="contained" onClick={() => newDocument(newFolder())}>
            New folder
          </StyledButton>
        </ButtonGroup>
      </Box>
      <EditDocumentDialog open={editDocumentForm.open} submit={documentSubmitHandler}
                          cancel={() => setEditDocumentForm({open: false, document: editDocumentForm.document})}
                          defaultDocument={editDocumentForm.document}/>
      <Box my={2}> <Divider variant="middle"/> </Box>
      <DocumentTree documents={wiki.pages}
                    onDocumentCreated={newDocument} onDocumentUpdated={editDocument}
                    onDocumentDeleted={deleteDocument} onDocumentMove={moveDocument}/>
    </>);
}

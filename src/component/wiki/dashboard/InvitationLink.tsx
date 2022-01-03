import React, {FunctionComponent} from "react";
import {Button, ListItem} from "@mui/material";
import {TextFieldCopy} from "../../generic/TextFieldCopy";
import {DangerButton} from "../../generic/DangerButton";
import {currentPlayerSelector, Group, wikiAtom} from "../../../atom/WikiAtom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {serviceLocatorAtom} from "../../../atom/ServiceLocatorAtom";
import {addNotificationSelector} from "../../../atom/NotificationAtom";
import {GM_GROUP} from "../../../model/v2/Permission";

export interface Props {
  group: Group;
}

export const InvitationLink: FunctionComponent<Props> = (props: Props) => {
  const {group} = props;

  const wiki = useRecoilValue(wikiAtom);
  const serviceLocator = useRecoilValue(serviceLocatorAtom);
  const addNotification = useSetRecoilState(addNotificationSelector);

  const currentPlayer = useRecoilValue(currentPlayerSelector);
  let canInvite = currentPlayer.group === GM_GROUP;

  const generateLink = () => {
    serviceLocator?.wikiService.generateInvitationLink(wiki.id, group.name)
      .then(() => addNotification({severity: "success", title: "Success", text: "Invitation link generated"}))
      .catch(() => addNotification({
        severity: "error",
        title: "Error",
        text: "Failed to generate the invitation link"
      }));
  }

  const deleteLink = () => {
    serviceLocator?.wikiService.deleteInvitationLink(wiki.id, group.name)
      .then(() => addNotification({severity: "success", title: "Success", text: "Invitation link deleted"}))
      .catch(() => addNotification({
        severity: "error",
        title: "Error",
        text: "Failed to delete the invitation link"
      }));
  }

  if (group.invitationLink) {
    const currentUrl = window.location.protocol + '//' + window.location.host;
    const invitationLink = `${currentUrl}/wiki/${wiki.id}/join/${group.invitationLink}`;

    return (
      <>
        <ListItem key={"item-invitation"}>
          <TextFieldCopy text={invitationLink}/>
        </ListItem>
        <ListItem key={"item-delete-invitation"}>
          <DangerButton color="secondary" variant="contained" onClick={deleteLink}>
            Delete invitation link
          </DangerButton>
        </ListItem>
      </>
    )
  } else if (canInvite) {
    return (
      <ListItem key={"item-generate-invitation"}>
        <Button variant="contained" color="primary" onClick={generateLink}>Generate invitation link</Button>
      </ListItem>
    )
  }

  return <></>;
}

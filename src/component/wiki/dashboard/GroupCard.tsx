import React, {FunctionComponent, useEffect, useState} from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import {getPlayer, Group, WikiMinimal} from "../../../model/Wiki";
import {UserProfileMinimal} from "../../../service/user/UserService";
import {getApplication} from "../../../Application";
import {RequestException} from "../../../service/QueryEngine";
import {TextFieldCopy} from "../../generic/TextFieldCopy";
import {canAdmin} from "../../../model/Permission";
import {DangerButton} from "../../generic/DangerButton";

export interface Props {
  wiki: WikiMinimal;
  group: Group;
  generateLink: () => void;
  deleteLink: () => void;
}

export const GroupCard: FunctionComponent<Props> = (props: Props) => {
  const {group, wiki} = props;

  const [users, setUsers] = useState([] as Array<UserProfileMinimal>);

  useEffect(() => {
    if (props.group.members.length > 0) {
      getApplication().serviceLocator.userService.getUsers(props.group.members)
        .then((users) => {
          setUsers(users);
        })
        .catch((e: RequestException) => {
          getApplication().notificationManager.errorNotification(['Failed to retrieved the users', e.message]);
        });
    }
  }, [props.group]);

  let invitationLinkItem = (<></>);
  if (group.invitationKey) {
    const currentUrl = window.location.protocol + '//' + window.location.host;
    const invitationLink = `${currentUrl}/wiki/${wiki.id}/join/${group.invitationKey}`;
    invitationLinkItem = (
      <>
        <ListItem>
          <TextFieldCopy text={invitationLink}/>
        </ListItem>
        <ListItem>
          <DangerButton color="secondary" variant="contained" onClick={props.deleteLink}>Delete invitation
            link</DangerButton>
        </ListItem>
      </>
    )
  } else {
    const player = getPlayer(wiki);
    const isAdmin = canAdmin(player, wiki);
    if (isAdmin) {
      invitationLinkItem = (
        <ListItem>
          <Button variant="contained" color="primary" onClick={props.generateLink}>Generate invitation link</Button>
        </ListItem>
      )
    }
  }

  return (
    <>
      <Card>
        <CardHeader title={group.name}/>
        <CardContent>
          {users.map(u => {
            return (
              <ListItem key={u.userId}>
                <ListItemAvatar>
                  <Avatar src={u.imageUrl}/>
                </ListItemAvatar>
                <ListItemText primary={u.username}/>
              </ListItem>)
          })}
          <Box my={2}> <Divider variant="middle"/> </Box>
          {invitationLinkItem}
        </CardContent>
      </Card>
    </>);
}

import React, {FunctionComponent} from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import {UserProfileMinimal} from "../../../service/user/UserService";
import {useTranslation} from "react-i18next";
import {Group} from "../../../atom/WikiAtom";
import {InvitationLink} from "./InvitationLink";

export interface Props {
  group: Group;
  users: Array<UserProfileMinimal>;
}

export const GroupCard: FunctionComponent<Props> = (props: Props) => {
  const {t, ready} = useTranslation();
  const {group, users} = props;

  const content = group.members.map(m => users.find(u => u.userId === m.userId)).map(u => {
    if (u) {
      return (
        <ListItem key={`item-${group.name}-${u.userId}`}>
          <ListItemAvatar>
            <Avatar src={u.imageUrl}/>
          </ListItemAvatar>
          <ListItemText primary={u.username}/>
        </ListItem>)
    }
    return <></>
  });

  const contentList = content.length > 0 ? (<List> {content} </List>) : <></>;

  return (
    <>
      {
        !ready ? <></> :
          <Card>
            <CardHeader title={t(group.name)}/>
            <CardContent>
              {contentList}
              <Box my={2}> <Divider variant="middle"/> </Box>
              <InvitationLink group={group}/>
            </CardContent>
          </Card>
      }
    </>);
}

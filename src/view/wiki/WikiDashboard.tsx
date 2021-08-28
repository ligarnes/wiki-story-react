import React, {FunctionComponent, useEffect, useState} from "react";
import {Container, Grid, Typography} from "@material-ui/core";
import {WikiComplete} from "../../model/Wiki";
import {getApplication} from "../../Application";
import {RequestException} from "../../service/QueryEngine";
import {GroupCard} from "../../component/wiki/dashboard/GroupCard";

export interface Props {
  wikiId: string;
}

/**
 * The wiki dashboard
 * @constructor
 */
export const WikiDashboard: FunctionComponent<Props> = (props: Props) => {
  // load folders
  const wikiInfo: WikiComplete = {
    id: "",
    title: "Wiki",
    groupList: [],
    permissionList: [],
    pages: [],
    defaultPermissions: []
  } as WikiComplete;

  const [wiki, setWiki] = useState(wikiInfo);

  const loadWiki = () => {
    getApplication().serviceLocator.wikiService.getWiki(props.wikiId)
      .then((wiki) => {
        setWiki(wiki);
      })
      .catch((e: RequestException) => {
        getApplication().notificationManager.errorNotification(['Failed to retrieved the article', e.message]);
      });
  }

  useEffect(() => loadWiki(), [props.wikiId]);

  const groupCards = wiki.groupList.map(group => {
    const generateLink = () => {
      getApplication().serviceLocator.wikiService.generateInvitationLink(wiki.id, group.groupId)
        .then(() => {
          getApplication().notificationManager.successNotification(`Invitation link generated`);
          loadWiki();
        })
        .catch(err => getApplication().notificationManager.errorNotification(["Failed to generate the invitation link", err.message]));
    }

    const deleteLink = () => {
      getApplication().serviceLocator.wikiService.deleteInvitationLink(wiki.id, group.groupId)
        .then(() => {
          getApplication().notificationManager.successNotification(`Invitation link deleted`);
          loadWiki();
        })
        .catch(err => getApplication().notificationManager.errorNotification(["Failed to delete the invitation link", err.message]));
    }

    return (<Grid item key={group.groupId} xs={4}>
      <GroupCard wiki={wiki} group={group} generateLink={generateLink} deleteLink={deleteLink}/></Grid>)
  });

  return (
    <Container>
      <Typography variant="h1">{wiki.title}</Typography>
      <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={3}>
        {groupCards}
      </Grid>
    </Container>
  );
}

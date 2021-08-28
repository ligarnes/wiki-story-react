import React, {FunctionComponent, useEffect, useState} from "react";
import {Box, CircularProgress, Container, Paper, Typography} from "@material-ui/core";
import {getApplication} from "../../Application";
import {RequestException} from "../../service/QueryEngine";
import {useHistory} from "react-router";

export interface Props {
  wikiId: string;
  invitationKey: string;
}

/**
 * The wiki dashboard
 * @constructor
 */
export const WikiJoinView: FunctionComponent<Props> = (props: Props) => {
  const {wikiId, invitationKey} = props;
  const history = useHistory();

  const [state, setState] = useState({loading: true, error: false, message: ""});

  useEffect(() => {
    getApplication().serviceLocator.wikiService.joinInvitationLink(wikiId, invitationKey)
      .then(() => {
        getApplication().notificationManager.successNotification("You have joined the Wiki !")
        setState({loading: false, error: false, message: ""});
        setTimeout(() => history.push(`//wiki/${wikiId}/`), 5000);
      })
      .catch((e: RequestException) => {
        getApplication().notificationManager.errorNotification(['You cannot join the wiki.', e.message]);
        setState({loading: false, error: true, message: e.message});
        setTimeout(() => history.push(`/my-wikis`), 5000);
      });
  }, [history, invitationKey, wikiId]);

  if (state.loading) {
    return (
      <Container>
        <Box m={3} p={3} component={Paper}>
          <Box mb={2}>
            <Typography variant="h3">Joining the wiki</Typography>
          </Box>
          <Typography>Please wait while we validate</Typography>
          <CircularProgress/>
        </Box>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container>
        <Box m={3} p={3} component={Paper}>
          <Box mb={2}>
            <Typography variant="h3" color={"secondary"}>You cannot join the Wiki</Typography>
          </Box>
          <Typography>Reason: {state.message}</Typography>
          <Typography>You will be redirected soon</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box m={3} p={3} component={Paper}>
        <Box mb={2}>
          <Typography variant="h3" color="primary">You have joined the Wiki !</Typography>
        </Box>
        <Typography>You will be redirected soon</Typography>
      </Box>
    </Container>
  );
}

import React, {FunctionComponent} from "react";
import {Avatar, Card, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import {UserProfile} from "../service/user/UserService";
import {format} from "date-fns";

export interface Props {
  userProfile: UserProfile
}

export const UserProfileCard: FunctionComponent<Props> = (props: Props) => {

  const {userProfile} = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            avatar={<Avatar src={userProfile.imageUrl ? userProfile.imageUrl : '/images/avatars/avatar.png'}/>}
            title={userProfile.username} subheader={`Join at: ${format(userProfile.registrationTime, "PPP")}`}/>
          <CardContent>
            <div>
              <Typography variant="body1">
                <b>Email:</b> {userProfile.email}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

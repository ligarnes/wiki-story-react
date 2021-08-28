import React, {FunctionComponent, useEffect, useState} from "react";
import {Container} from "@material-ui/core";
import {UserProfileCard} from "../../component/UserProfileCard";
import {emptyUserProfile} from "../../service/user/UserService";
import {getApplication} from "../../Application";


/**
 * The dashboard page
 * @constructor
 */
export const MyProfile: FunctionComponent<unknown> = () => {

  const [userProfile, setUserProfile] = useState(emptyUserProfile())
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getApplication().serviceLocator.userService.getCurrentUserProfile()
      .then((userProfile) => {
        setLoading(false);
        setUserProfile(userProfile);
      })
      .catch(e => {
        setHasError(true)
        setLoading(false);
        getApplication().notificationManager.errorNotification(['Failed to retrieved the user', e]);
      });
  });

  return (
    <Container>
      <>
        {loading ? <div>Loading...</div> :
          hasError ? <div>Error occurred.</div> :
            <>
              <UserProfileCard userProfile={userProfile}/>
            </>}
      </>
    </Container>
  );
}

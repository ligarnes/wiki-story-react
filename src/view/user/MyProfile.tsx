import React, {FunctionComponent} from "react";
import {Container} from "@mui/material";
import {UserProfileCard} from "../../component/UserProfileCard";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../atom/UserAtom";

/**
 * The dashboard page
 * @constructor
 */
export const MyProfile: FunctionComponent<unknown> = () => {

  const userProfile = useRecoilValue(userAtom)

  return (
    <Container>
      <>
        {userProfile && <UserProfileCard userProfile={userProfile}/>}
      </>
    </Container>
  );
}

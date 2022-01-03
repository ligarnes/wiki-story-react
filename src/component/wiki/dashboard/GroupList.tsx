import React, {FunctionComponent, useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {groupsSelector, wikiAtom} from "../../../atom/WikiAtom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {serviceLocatorAtom} from "../../../atom/ServiceLocatorAtom";
import {addNotificationSelector} from "../../../atom/NotificationAtom";
import {UserProfileMinimal} from "../../../service/user/UserService";
import {RequestException} from "../../../service/QueryEngine";
import {GroupCard} from "./GroupCard";


export const GroupList: FunctionComponent<unknown> = () => {
  const wiki = useRecoilValue(wikiAtom);

  const serviceLocator = useRecoilValue(serviceLocatorAtom);
  const addNotification = useSetRecoilState(addNotificationSelector);
  const groups = useRecoilValue(groupsSelector);

  const [users, setUsers] = useState([] as Array<UserProfileMinimal>);

  useEffect(() => {
    if (wiki.players.length > 0) {
      serviceLocator?.userService.getUsers(wiki.players.map(player => player.userId))
        .then((users) => setUsers(users))
        .catch((e: RequestException) => {
          addNotification({severity: "error", title: "Error", text: "Failed to retrieved the users"});
        });
    }
  }, [serviceLocator, wiki, addNotification]);

  const groupCards = groups.map(group => {
    return (<Grid item xs={4} key={`grid-${group.name}`}>
      <GroupCard key={`card-${group.name}`} group={group} users={users}/>
    </Grid>)
  });

  return (
    <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={3}>
      {groupCards}
    </Grid>
  );
}

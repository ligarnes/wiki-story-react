import React, {FunctionComponent} from "react";
import {Container, Typography} from "@mui/material";
import {useRecoilValue} from "recoil";
import {wikiAtom} from "../../atom/WikiAtom";
import {GroupList} from "../../component/wiki/dashboard/GroupList";

/**
 * The wiki dashboard
 * @constructor
 */
export const WikiDashboard: FunctionComponent<unknown> = () => {
  const wiki = useRecoilValue(wikiAtom);

  return (
    <Container>
      <Typography variant="h1">{wiki.title}</Typography>
      <GroupList/>
    </Container>
  );
}

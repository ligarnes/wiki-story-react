import React, {FunctionComponent} from "react";
import {WikiListPage} from "../../component/WikiListPage";
import {Container} from "@mui/material";


/**
 * The dashboard page
 * @constructor
 */
export const Dashboard: FunctionComponent<unknown> = () => {

  return (
    <Container>
      <WikiListPage/>
    </Container>
  );
}

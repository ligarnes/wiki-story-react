import React, {FunctionComponent} from "react";
import {Container} from "@material-ui/core";
import {WikiListPage} from "../../component/WikiListPage";


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

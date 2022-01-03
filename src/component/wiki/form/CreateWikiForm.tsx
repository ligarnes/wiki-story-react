import React, {FunctionComponent} from "react";
import {Grid, TextField} from "@mui/material";
import {WikiInfoCreate} from "../../../model/v2/Wiki";

export interface Props {
  wiki: WikiInfoCreate;
  onChange: (wiki: WikiInfoCreate) => void;
}

/**
 * The form to create a new wiki.
 *
 * @param {Props} props the properties
 * @constructor
 */
export const CreateWikiForm: FunctionComponent<Props> = (props: Props) => {

  const onTitleChange = (event: { target: { value: string } }) => {
    const newWiki = {...props.wiki, title: event.target.value};
    props.onChange(newWiki);
  }

  return (
    <>
      <form noValidate autoComplete="off">
        <Grid container spacing={2} direction="column" alignItems="center">
          <Grid item>
            <TextField id="name" variant="outlined" label="Name" required
                       onChange={onTitleChange} value={props.wiki.title}/>
          </Grid>
        </Grid>
      </form>
    </>);
}

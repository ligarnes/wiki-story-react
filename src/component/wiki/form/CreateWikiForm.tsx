import React, {FunctionComponent} from "react";
import {Grid, TextField} from "@material-ui/core";
import {WikiMinimalCreate} from "../../../model/Wiki";

export interface Props {
  wiki: WikiMinimalCreate;
  onChange: (wiki: WikiMinimalCreate) => void;
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

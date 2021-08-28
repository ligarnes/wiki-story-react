import React, {FunctionComponent} from "react";
import {createStyles, IconButton, InputBase, Paper, Theme} from "@material-ui/core";
import {FileCopy} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {CopyToClipboard} from "react-copy-to-clipboard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    }
  })
);

export interface Props {
  text: string;
}

export const TextFieldCopy: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  return (
    <>
      <Paper component="form" className={classes.root} elevation={3}>
        <InputBase className={classes.input} placeholder="Invitation link" value={props.text}
                   inputProps={{'aria-label': 'Invitation link'}} disabled={true}/>
        <CopyToClipboard text={props.text}>
          <IconButton className={classes.iconButton} aria-label="copy invitation link">
            <FileCopy/>
          </IconButton>
        </CopyToClipboard>
      </Paper>
    </>);
}
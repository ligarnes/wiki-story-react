import React, {FunctionComponent} from "react";
import {IconButton, InputBase, Paper} from "@mui/material";
import {FileCopy} from "@mui/icons-material";
import {CopyToClipboard} from "react-copy-to-clipboard";

export interface Props {
  text: string;
}

export const TextFieldCopy: FunctionComponent<Props> = (props: Props) => {

  return (
    <>
      <Paper component="form" sx={{
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
      }} elevation={3}>
        <InputBase sx={{marginLeft: 1, flex: 1,}} placeholder="Invitation link" value={props.text} disabled={true}/>
        <CopyToClipboard text={props.text}>
          <IconButton sx={{padding: '10px',}} aria-label="copy invitation link" size="small">
            <FileCopy/>
          </IconButton>
        </CopyToClipboard>
      </Paper>
    </>);
}
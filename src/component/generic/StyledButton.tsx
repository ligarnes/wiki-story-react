import React, {FunctionComponent} from "react";
import {Button, ButtonProps, createTheme, MuiThemeProvider, Theme} from "@material-ui/core";

type StyledButtonProps = ButtonProps & {};

const smallButtonTheme = (theme: Theme) =>
  createTheme({
    ...theme,
    typography: {
      button: {
        fontSize: 10,
        textTransform: "none"
      }
    }
  });

export const StyledButton: FunctionComponent<StyledButtonProps> = (props: ButtonProps) => {
  const {...other} = props;

  return (
    <MuiThemeProvider theme={smallButtonTheme}>
      <Button  {...other}/>
    </MuiThemeProvider>
  );
}
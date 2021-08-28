import React, {FunctionComponent} from "react";
import {Button, ButtonProps, createTheme, MuiThemeProvider, Theme} from "@material-ui/core";

type StyledButtonProps = ButtonProps & {};

const dangerButtonTheme = (theme: Theme) =>
  createTheme({
    ...theme,
    palette: {
      secondary: {
        main: theme.palette.error.main,
      }
    }
  });

export const DangerButton: FunctionComponent<StyledButtonProps> = (props: ButtonProps) => {
  const {...other} = props;

  return (
    <MuiThemeProvider theme={dangerButtonTheme}>
      <Button  {...other}/>
    </MuiThemeProvider>
  );
}
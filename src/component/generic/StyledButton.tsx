import React, {FunctionComponent} from "react";
import {Button, ButtonProps, Theme} from "@mui/material";
import {createTheme, ThemeProvider} from '@mui/material/styles';

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
    <ThemeProvider theme={smallButtonTheme}>
      <Button  {...other}/>
    </ThemeProvider>
  );
}
import React, {FunctionComponent} from "react";
import {Button, ButtonProps} from "@mui/material";
import {createTheme, Theme, ThemeProvider} from '@mui/material/styles';

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
    <ThemeProvider theme={dangerButtonTheme}>
      <Button  {...other}/>
    </ThemeProvider>
  );
}
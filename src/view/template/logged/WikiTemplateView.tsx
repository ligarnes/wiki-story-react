import React, {FunctionComponent} from "react";
import {SnackNotificationComponent} from "../../../component/SnackNotificationComponent";
import {DRAWER_WIDTH, DrawerComponent} from "../../../component/menu/DrawerComponent";
import {TopMenuWiki} from "../../../component/menu/TopMenuWiki";
import {WikiDrawer} from "../../wiki/WikiDrawer";
import {Theme, useTheme} from "@mui/material/styles";
import {Box} from "@mui/material";
import {SxProps} from "@mui/system";

/**
 * The WikiMinimal layout component.
 * @param {React.PropsWithChildren<unknown>} props the properties of the component
 * @constructor
 */
export const WikiTemplateView: FunctionComponent<unknown> = (props: React.PropsWithChildren<unknown>) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const margin = open ? 0 : `${-DRAWER_WIDTH}px`;
  const contentStyle: SxProps<Theme> = {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: margin,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
    })
  };

  return (
    <Box sx={{display: "flex"}}>
      <TopMenuWiki isDrawerOpen={open} handleDrawerOpen={() => setOpen(true)}/>
      <DrawerComponent isDrawerOpen={open} handleDrawerClose={() => setOpen(false)}>
        <WikiDrawer/>
      </DrawerComponent>
      <Box sx={contentStyle}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(0, 1),
          // Necessary for content to be below app bar
          ...theme.mixins.toolbar,
          justifyContent: "flex-end"
        }}/>
        <div>
          {props.children}
          <SnackNotificationComponent/>
        </div>
      </Box>
    </Box>
  );
}

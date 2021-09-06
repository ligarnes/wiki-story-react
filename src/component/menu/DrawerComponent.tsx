import React, {FunctionComponent, PropsWithChildren} from "react";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

export const DRAWER_WIDTH = 320;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0
  },
  drawerPaper: {
    width: DRAWER_WIDTH
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // Necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  }
}));

export interface Props {
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
}

/**
 * The drawer menu component.
 *
 * @param {Props} props the properties of the component
 * @constructor
 */
export const DrawerComponent: FunctionComponent<Props> = (props: PropsWithChildren<Props>) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Drawer className={classes.drawer} variant="persistent" anchor="left" open={props.isDrawerOpen}
            classes={{paper: classes.drawerPaper}}>
      <div className={classes.drawerHeader}>
        <IconButton onClick={props.handleDrawerClose}>
          {theme.direction === "ltr" ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
        </IconButton>
      </div>
      <Divider/>
      {props.children}
    </Drawer>
  );
}
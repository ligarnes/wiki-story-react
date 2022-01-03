import React, {FunctionComponent, PropsWithChildren} from "react";
import {Box, Divider, Drawer, IconButton} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useTheme} from '@mui/material/styles';

export const DRAWER_WIDTH = 320;

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
  const theme = useTheme();

  const drawerStyle = {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
    },
  }

  const iconBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  };

  return (
    <Drawer sx={drawerStyle} variant="persistent" anchor="left" open={props.isDrawerOpen}>
      <Box sx={iconBoxStyle}>
        <IconButton onClick={props.handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
        </IconButton>
      </Box>
      <Divider/>
      {props.children}
    </Drawer>
  );
}
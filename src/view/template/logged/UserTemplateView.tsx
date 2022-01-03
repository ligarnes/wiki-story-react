import React, {FunctionComponent} from "react";
import {TopMenu} from "../../../component/menu/TopMenu";
import {DRAWER_WIDTH, DrawerComponent} from "../../../component/menu/DrawerComponent";
import {SnackNotificationComponent} from "../../../component/SnackNotificationComponent";
import {faBook, faUser} from "@fortawesome/free-solid-svg-icons";
import {Box, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SxProps} from "@mui/system";
import {Theme, useTheme} from "@mui/material/styles";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";

interface DrawerMenuItem {
  icon: IconDefinition;
  text: string;
  link: string;
}

/**
 * The dashboard layout component.
 * @param {React.PropsWithChildren<unknown>} props the properties of the component
 * @constructor
 */
export const UserTemplateView: FunctionComponent<unknown> = (props: React.PropsWithChildren<unknown>) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const items: Array<DrawerMenuItem> = [
    {icon: faBook, text: "My Wikis", link: "/my-wikis"},
    {icon: faUser, text: "My Profile", link: "/my-profile"}
  ];

  const itemMenu = items.map((item, idx) => {
      return (<ListItem button key={`item-${idx}`} component="a"
                        href={item.link}>
        <ListItemIcon><FontAwesomeIcon icon={item.icon}/></ListItemIcon>
        <ListItemText primary={item.text}/>
      </ListItem>);
    }
  );

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

  const belowAppBar = {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // Necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  };

  return (
    <Box sx={{display: "flex"}}>
      <TopMenu title="Wiki Story" isDrawerOpen={open} handleDrawerOpen={handleDrawerOpen}/>
      <DrawerComponent isDrawerOpen={open} handleDrawerClose={handleDrawerClose}>
        <List>
          {itemMenu}
        </List>
      </DrawerComponent>
      <Box sx={contentStyle}>
        <Box sx={belowAppBar}/>
        <div>
          {props.children}
          <SnackNotificationComponent/>
        </div>
      </Box>
    </Box>
  );
}

import React, {FunctionComponent} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {TopMenu} from "../../../component/menu/TopMenu";
import {DRAWER_WIDTH, DrawerComponent} from "../../../component/menu/DrawerComponent";
import clsx from "clsx";
import {SnackNotificationComponent} from "../../../component/SnackNotificationComponent";
import {getApplication} from "../../../Application";
import {faBook, faUser} from "@fortawesome/free-solid-svg-icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ListItemText from "@material-ui/core/ListItemText";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // Necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -DRAWER_WIDTH
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

interface DrawerMenuItem {
  icon: IconProp;
  text: string;
  link: string;
}

/**
 * The dashboard layout component.
 * @param {React.PropsWithChildren<unknown>} props the properties of the component
 * @constructor
 */
export const UserTemplateView: FunctionComponent<unknown> = (props: React.PropsWithChildren<unknown>) => {
  const classes = useStyles();
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

  return (
    <div className={classes.root}>
      <TopMenu title="Wiki Story" isDrawerOpen={open} handleDrawerOpen={handleDrawerOpen}/>
      <DrawerComponent isDrawerOpen={open} handleDrawerClose={handleDrawerClose}>
        <List>
          {itemMenu}
        </List>
      </DrawerComponent>
      <main className={clsx(classes.content, {[classes.contentShift]: open})}>
        <div className={classes.drawerHeader}/>
        <div>
          {props.children}

          <SnackNotificationComponent notificationManager={getApplication().notificationManager}/>
        </div>
      </main>
    </div>
  );
}

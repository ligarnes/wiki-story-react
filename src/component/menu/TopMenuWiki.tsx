import React, {FunctionComponent} from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import {DRAWER_WIDTH} from "./DrawerComponent";
import {AccountCircle, Settings} from "@material-ui/icons";
import {useHistory} from "react-router";
import {getApplication} from "../../Application";
import {WikiMinimal} from "../../model/Wiki";
import {MenuButton} from "./MenuButton";


const useStyles = makeStyles(theme => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: DRAWER_WIDTH,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: "none"
  },
  offset: theme.mixins.toolbar,
}));

export interface Props {
  wikiMinimal: WikiMinimal;
  isDrawerOpen: boolean;
  handleDrawerOpen: () => void;
}

/**
 * The top menu component.
 *
 * @param {Props} props the properties
 * @constructor
 */
export const TopMenuWiki: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();

  const handleManageWiki = () => {
    history.push(`/wiki/${props.wikiMinimal.id}/`);
  }

  const handleMyWikis = () => {
    history.push("/my-wikis");
  }

  const handleMyProfile = () => {
    history.push("/my-profile");
  };

  const handleLogout = () => {
    getApplication().serviceLocator.loginService.logout();
    history.push("/");
  };

  return (
    <>
      <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: props.isDrawerOpen})}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={props.handleDrawerOpen} edge="start"
                      className={clsx(classes.menuButton, props.isDrawerOpen && classes.hide)}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap>{props.wikiMinimal.title}</Typography>
          <div>
            <MenuButton icon={Settings} menuItems={[{title: "Manage wiki", action: handleManageWiki}]}/>
          </div>
          <div>
            <MenuButton icon={AccountCircle} menuItems={[{title: "My wikis", action: handleMyWikis},
              {title: "Profile", action: handleMyProfile},
              {title: "Logout", action: handleLogout}]}/>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.offset}/>
    </>);
}

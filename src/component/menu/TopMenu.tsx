import React, {FunctionComponent} from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import {DRAWER_WIDTH} from "./DrawerComponent";
import {Menu, MenuItem} from "@material-ui/core";
import {AccountCircle} from "@material-ui/icons";
import {useHistory} from "react-router";
import {getApplication} from "../../Application";


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
  title: string;
  isDrawerOpen: boolean;
  handleDrawerOpen: () => void;
}

/**
 * The top menu component.
 *
 * @param {Props} props the properties
 * @constructor
 */
export const TopMenu: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMyWikis = () => {
    setAnchorEl(null);
    history.push("/my-wikis");
  }

  const handleMyProfile = () => {
    setAnchorEl(null);
    history.push("/my-profile");
  };

  const handleLogout = () => {
    setAnchorEl(null);
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
          <Typography variant="h6" className={classes.title} noWrap>{props.title}</Typography>
          <div>
            <IconButton aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true"
                        onClick={handleMenu} color="inherit">
              <AccountCircle/>
            </IconButton>
            <Menu id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{vertical: 'top', horizontal: 'right',}}
                  keepMounted
                  transformOrigin={{vertical: 'top', horizontal: 'right',}}
                  open={open} onClose={handleMyProfile}>
              <MenuItem onClick={handleMyWikis}>My wikis</MenuItem>
              <MenuItem onClick={handleMyProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.offset}/>
    </>);
}

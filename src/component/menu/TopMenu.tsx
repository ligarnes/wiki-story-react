import React, {FunctionComponent} from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {DRAWER_WIDTH} from "./DrawerComponent";
import {AppBar, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {useHistory} from "react-router";
import {useRecoilValue} from "recoil";
import {serviceLocatorAtom} from "../../atom/ServiceLocatorAtom";
import {Theme, useTheme} from "@mui/material/styles";
import {SxProps} from "@mui/system";

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
  const history = useHistory();
  const theme = useTheme();

  const serviceLocator = useRecoilValue(serviceLocatorAtom);

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
    serviceLocator?.loginService.logout();
    history.push("/");
  };

  const appBarStyle: SxProps<Theme> = {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(props.isDrawerOpen && {
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  };

  let menuButton = {
    marginRight: theme.spacing(2),
    ...(props.isDrawerOpen && {
      display: "none"
    })
  }

  return (
    <>
      <AppBar position="fixed" sx={appBarStyle}>
        <Toolbar>
          <IconButton color="inherit" onClick={props.handleDrawerOpen} edge="start" sx={menuButton}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1}} noWrap>{props.title}</Typography>
          <div>
            <IconButton aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
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
    </>);
}

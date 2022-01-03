import React, {FunctionComponent} from "react";
import {DRAWER_WIDTH} from "./DrawerComponent";
import {AccountCircle, Menu, Settings} from "@mui/icons-material";
import {useHistory} from "react-router";
import {MenuButton} from "./MenuButton";
import {useRecoilValue} from "recoil";
import {serviceLocatorAtom} from "../../atom/ServiceLocatorAtom";
import {wikiAtom} from "../../atom/WikiAtom";
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {Theme, useTheme} from "@mui/material/styles";
import {SxProps} from "@mui/system";

export interface Props {
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
  const history = useHistory();
  const theme = useTheme();

  const serviceLocator = useRecoilValue(serviceLocatorAtom);

  const wiki = useRecoilValue(wikiAtom);

  const handleManageWiki = () => {
    history.push(`/wiki/${wiki?.id}/`);
  }

  const handleMyWikis = () => {
    history.push("/my-wikis");
  }

  const handleMyProfile = () => {
    history.push("/my-profile");
  };

  const handleLogout = () => {
    serviceLocator?.loginService.logout();
    history.push("/");
  };

  let appBarStyle: SxProps<Theme> = {
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

  const menuButton = {
    marginRight: theme.spacing(2),
    ...(props.isDrawerOpen && {
      display: "none"
    }),
  }

  return (
    <>
      <AppBar position="fixed" sx={appBarStyle}>
        <Toolbar>
          <IconButton color="inherit" onClick={props.handleDrawerOpen} edge="start" sx={menuButton}>
            <Menu/>
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1}} noWrap>{wiki?.title}</Typography>
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
    </>);
}

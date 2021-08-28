import React, {FunctionComponent} from "react";
import IconButton from "@material-ui/core/IconButton";
import {SvgIconComponent} from "@material-ui/icons";
import {Menu, MenuItem} from "@material-ui/core";

export interface Props {
  icon: SvgIconComponent;
  menuItems: Array<{ title: string, action: () => void }>
}

/**
 * The top menu component.
 *
 * @param {Props} props the properties
 * @constructor
 */
export const MenuButton: FunctionComponent<Props> = (props: Props) => {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  }

  const menuClick = (action: () => void) => {
    setAnchorEl(null);
    action();
  }

  const Icon = props.icon;

  return (
    <>
      <IconButton aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
        <Icon/>
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={open} onClose={closeMenu}
            anchorOrigin={{vertical: 'top', horizontal: 'left',}}
            transformOrigin={{vertical: 'top', horizontal: 'left',}}>
        {props.menuItems
          .map(menu => <MenuItem key={menu.title} onClick={() => menuClick(menu.action)}>{menu.title}</MenuItem>)}
      </Menu>
    </>
  );
}
import {makeStyles} from "@material-ui/core/styles";
import {Box, createStyles, IconButton, Menu, MenuItem, Theme, Tooltip, Typography} from "@material-ui/core";
import {TreeItem, TreeItemProps} from "@material-ui/lab";
import React, {FunctionComponent} from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {v4 as uuidv4} from "uuid";

declare module 'csstype' {
  interface Properties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

export interface Option {
  title: string;
  onClick?: () => void;
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: IconProp;
  labelText: string;
  icons: Array<{ icon: IconProp, color?: string, tooltip: string }>;
  options: Array<Option>;
};

const useTreeItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      '&:hover > $content': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
        backgroundColor: 'transparent',
      },
    },
    content: {
      color: theme.palette.text.secondary,
      paddingRight: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
      '$expanded > &': {
        fontWeight: theme.typography.fontWeightRegular,
      },
    },
    group: {
      marginLeft: 0,
      '& $content': {
        paddingLeft: theme.spacing(2),
      },
    },
    expanded: {},
    selected: {
      color: theme.palette.text.secondary,
      '&:focus > $content, &$selected > $content': {
        backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
        color: 'var(--tree-view-color)',
      },
      '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
        backgroundColor: 'transparent',
      },
    },
    label: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
    labelRoot: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
      marginRight: theme.spacing(1),
    },
    labelText: {
      fontWeight: 'inherit',
      flexGrow: 1,
    },
  }),
);

export const StyledTreeItem: FunctionComponent<StyledTreeItemProps> = (props: StyledTreeItemProps) => {
  const classes = useTreeItemStyles();
  const {labelText, labelIcon, color, bgColor, onLabelClick, options, icons, ...other} = props;

  const style = {
    "--tree-view-color": color,
    '--tree-view-bg-color': bgColor,
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onInnerLabelClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as Element).matches(".MuiSvgIcon-root")
      || (event.target as Element).matches(".MuiIconButton-root")
      || (event.target as Element).matches(".MuiMenuItem-root")) {
      // Do not override the button click or the menu click
      event.preventDefault();
    } else if (onLabelClick) {
      onLabelClick.call(onLabelClick, event);
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const handleSelect = (event: React.MouseEvent<HTMLElement>, option: Option) => {
    event.preventDefault();
    if (option && option.onClick) {
      option.onClick.call(option.onClick);
    }
    setAnchorEl(null);
  };

  return (
    <TreeItem
      onLabelClick={onInnerLabelClick}
      label={
        <div className={classes.labelRoot}>
          <Box mr={1}>
            <FontAwesomeIcon icon={labelIcon}/>
          </Box>
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          {
            icons.map((val: { icon: IconProp, color?: string, tooltip: string }) => {
              return <Tooltip title={val.tooltip}>
                <Box mx={1} key={uuidv4()}> <FontAwesomeIcon color={val.color} icon={val.icon}/> </Box>
              </Tooltip>
            })
          }

          <Box mx={1}>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" color="inherit"
                        onClick={handleClick}>
              <MoreVertIcon/>
            </IconButton>
            <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleCancel}
                  PaperProps={{
                    style: {
                      maxHeight: 42 * 4.5,
                      width: '20ch',
                    },
                  }}>
              {options.map((option: Option) => (
                <MenuItem key={option.title} onClick={(evt) => handleSelect(evt, option)}>
                  {option.title}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </div>
      }
      style={style}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}
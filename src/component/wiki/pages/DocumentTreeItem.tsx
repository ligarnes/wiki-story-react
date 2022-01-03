import * as React from 'react';
import {FunctionComponent} from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeItem, {treeItemClasses, TreeItemProps} from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconButton, Menu, MenuItem, Tooltip} from "@mui/material";
import {v4 as uuidv4} from "uuid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

declare module 'react' {
  interface CSSProperties {
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
  onLabelClick?: () => void;
};

const StyledTreeItemRoot = styled(TreeItem)(({theme}) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

export const DocumentTreeItem: FunctionComponent<StyledTreeItemProps> = (props: StyledTreeItemProps) => {
  const {
    bgColor,
    color,
    labelIcon,
    icons,
    labelText,
    onLabelClick,
    options,
    ...other
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onInnerLabelClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as Element).matches(".MuiSvgIcon-root")
      || (event.target as Element).matches(".MuiIconButton-root")
      || (event.target as Element).matches(".MuiMenuItem-root")) {
      // Do not override the button click or the menu click
      //event.preventDefault();
    } else if (onLabelClick) {
      onLabelClick.call(onLabelClick);
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
    <StyledTreeItemRoot
      onClick={onInnerLabelClick}
      label={
        <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
          <Box mr={1}> <FontAwesomeIcon icon={labelIcon}/> </Box>
          <Typography variant="body2" sx={{flexGrow: 1}}>
            {labelText}
          </Typography>
          {
            icons.map((val: { icon: IconProp, color?: string, tooltip: string }) => {
              return <Tooltip title={val.tooltip} key={uuidv4()}>
                <Box mx={1}> <FontAwesomeIcon color={val.color} icon={val.icon}/> </Box>
              </Tooltip>
            })
          }
          <Box mx={1}>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" color="inherit"
                        onClick={handleClick}>
              <MoreVertIcon/>
            </IconButton>
            <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleCancel}
                  PaperProps={{style: {maxHeight: 42 * 4.5, width: '20ch',},}}>
              {options.map((option: Option) => (
                <MenuItem key={option.title} onClick={(evt) => handleSelect(evt, option)}>
                  {option.title}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      }
      style={{'--tree-view-color': color, '--tree-view-bg-color': bgColor}}
      {...other}
    />
  );
}
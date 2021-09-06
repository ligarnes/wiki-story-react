import React, {FunctionComponent} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Theme,
  Tooltip,
  Typography,
  withStyles
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  getPermissionIcon,
  PERMISSION_ADMIN,
  PERMISSION_NONE,
  PERMISSION_READ,
  PERMISSION_WRITE
} from "../../model/Permission";

const CustomToolTip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.hint,
    boxShadow: theme.shadows[3]
  },
}))(Tooltip);

/**
 * The WikiDocument tree component as legend.
 * @constructor
 */
export const DocumentTreeLegend: FunctionComponent<unknown> = () => {

  const admin = <React.Fragment>
    <Typography variant={"body1"}>The user can manage the document</Typography>
    <Typography variant={"body2"}>
      <ul>
        <li>Delete article</li>
        <li>Edit title</li>
        <li>Update permission</li>
        <li>Create new document (if it's a folder)</li>
        <li>Move the document</li>
        <li>Edit the document content</li>
        <li>Read the document content</li>
      </ul>
    </Typography>
  </React.Fragment>;

  const write = <React.Fragment>
    <Typography color="inherit">The user can update the document</Typography>
    <ul>
      <li>Create new document (if it's a folder)</li>
      <li>Move the document</li>
      <li>Edit the document content</li>
      <li>Read the document content</li>
    </ul>
  </React.Fragment>;
  const read = <React.Fragment>
    <Typography color="inherit">The user can read the document</Typography>
    <ul>
      <li>Read the document content</li>
    </ul>
  </React.Fragment>;
  const none = <React.Fragment>
    <Typography color="inherit">The user cannot view or modify the document</Typography>
  </React.Fragment>;

  return (
    <Accordion square={true} style={{boxShadow: "none"}}>
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <Typography>Legend</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <Box my={1} mx={2}>
            <CustomToolTip title={admin}>
              <Box component="span" mr={3}>
                <FontAwesomeIcon icon={getPermissionIcon(PERMISSION_ADMIN)}/>
              </Box>
            </CustomToolTip>
            <CustomToolTip title={admin}><Typography component="span">Admin</Typography></CustomToolTip>
          </Box>
          <Box my={1} mx={2}>
            <CustomToolTip title={write}>
              <Box component="span" mr={3}><FontAwesomeIcon icon={getPermissionIcon(PERMISSION_WRITE)}/></Box>
            </CustomToolTip>
            <CustomToolTip title={write}><Typography component="span">Write</Typography></CustomToolTip>
          </Box>
          <Box my={1} mx={2}>
            <CustomToolTip title={read}>
              <Box component="span" mr={3}><FontAwesomeIcon icon={getPermissionIcon(PERMISSION_READ)}/></Box>
            </CustomToolTip>
            <CustomToolTip title={read}><Typography component="span">Read only</Typography></CustomToolTip>
          </Box>
          <Box my={1} mx={2}>
            <CustomToolTip title={none}>
              <Box component="span" mr={3}><FontAwesomeIcon icon={getPermissionIcon(PERMISSION_NONE)}/></Box>
            </CustomToolTip>
            <CustomToolTip title={none}><Typography component="span">No access</Typography></CustomToolTip>
          </Box>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
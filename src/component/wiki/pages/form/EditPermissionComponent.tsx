import React, {FunctionComponent, useEffect, useState} from "react";
import {Box, createStyles, FormControl, Grid, InputLabel, MenuItem, Select, Theme, Typography} from "@material-ui/core";
import {
  getPermissionIcon,
  Permission,
  PERMISSION_ADMIN,
  PERMISSION_NONE,
  PERMISSION_READ,
  PERMISSION_WRITE
} from "../../../../model/Permission";
import {WikiMinimal} from "../../../../model/Wiki";
import {makeStyles} from "@material-ui/core/styles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 120,
    }
  }),
);

export interface Props {
  wikiInfo: WikiMinimal;
  permissionList: Array<Permission>;
  onChange: (permissionList: Array<Permission>) => void;
}

interface PermissionDesc extends Permission {
  title: string;
}

export const EditPermissionComponent: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [permissionList, setPermissionList] = useState([] as Array<PermissionDesc>);

  useEffect(() => {
    const permDesc = props.permissionList.map(perm => {
      const title = perm.group ?
        props.wikiInfo.groupList.find(grp => grp.name === perm.entityId)?.name
        : "Single user";
      return {
        group: perm.group,
        permission: perm.permission,
        entityId: perm.entityId,
        title: title
      } as PermissionDesc;
    });
    setPermissionList(permDesc);
  }, [props.wikiInfo, props.permissionList]);

  const handleChange = (event: React.ChangeEvent<{ value: any }>, permission: PermissionDesc) => {
    permission.permission = event.target.value;
    setPermissionList([...permissionList]);
    props.onChange(permissionList.map(p => {
      return {entityId: p.entityId, permission: p.permission, group: p.group} as Permission
    }));
  }

  return (
    <Box my={2}>
      <Box mb={2}>
        <Typography>Permissions</Typography>
      </Box>
      <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
        {permissionList.map(permission => {
          return (
            <Grid key={permission.entityId} item xs>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>{permission.title}</InputLabel>
                <Select label={permission.title} value={permission.permission}
                        onChange={(event) => handleChange(event, permission)}>
                  <MenuItem value={PERMISSION_NONE}>
                    <Box component={"span"} mr={3}><FontAwesomeIcon icon={getPermissionIcon(PERMISSION_NONE)}/></Box>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={PERMISSION_ADMIN}>
                    <Box component={"span"} mr={3}><FontAwesomeIcon icon={getPermissionIcon(PERMISSION_ADMIN)}/></Box>
                    Admin
                  </MenuItem>
                  <MenuItem value={PERMISSION_WRITE}>
                    <Box component={"span"} mr={3}><FontAwesomeIcon icon={getPermissionIcon(PERMISSION_WRITE)}/></Box>
                    Write
                  </MenuItem>
                  <MenuItem value={PERMISSION_READ}>
                    <Box component={"span"} mr={3}><FontAwesomeIcon icon={getPermissionIcon(PERMISSION_READ)}/></Box>
                    Read
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
    </Box>);
}

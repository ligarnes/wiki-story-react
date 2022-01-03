import React, {FunctionComponent, useEffect, useState} from "react";
import {Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Permission} from "../../../../model/v2/Wiki";
import {
  getPermissionIcon,
  getRole,
  PERMISSION_ADMIN,
  PERMISSION_NONE,
  PERMISSION_READ,
  PERMISSION_WRITE
} from "../../../../model/v2/Permission";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";

export interface Entity {
  id: string,
  name: string
}

export interface Props {
  permission: Permission;
  entities: Entity[];
  onChange: (permission: Permission) => void;
}

interface EntityPermission {
  entityId: string
  name: string;
  role: 'admin' | 'writer' | 'reader' | 'none';
}


function removeArray(array: string[], value: string) {
  const idx = array.indexOf(value);
  if (idx >= 0) {
    array.slice(idx, idx + 1);
  }
}

function newArray(array?: string[]) {
  if (array) {
    return [...array];
  }
  return [];
}

export const EditPermissionComponent: FunctionComponent<Props> = (props: Props) => {
  const [permissionList, setPermissionList] = useState([] as Array<EntityPermission>);

  useEffect(() => {
    const permDesc = props.entities.map(user => {
      const role = getRole(user.id, props.permission);
      return {
        entityId: user.id,
        name: user.name,
        role: role
      } as EntityPermission;
    });
    setPermissionList(permDesc);
  }, [props.entities, props.permission]);

  const handleChange = (permission: EntityPermission, event?: SelectChangeEvent<"admin" | "writer" | "reader" | "none">) => {
    const role = event?.target.value;

    const admins = newArray(props.permission.admins);
    const writes = newArray(props.permission.writes);
    const reads = newArray(props.permission.reads);

    removeArray(admins, permission.entityId);
    removeArray(writes, permission.entityId);
    removeArray(reads, permission.entityId);
    switch (role) {
      case PERMISSION_ADMIN:
        admins.push(permission.entityId);
        break;
      case PERMISSION_WRITE:
        writes.push(permission.entityId);
        break;
      case PERMISSION_READ:
        reads.push(permission.entityId);
        break;
    }
    props.onChange({admins: admins, writes: writes, reads: reads});
  }

  return (
    <Box my={2}>
      <Box mb={2}>
        <Typography>Permissions</Typography>
      </Box>
      <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
        {permissionList.map(entityPermission => {
          return (
            <Grid key={entityPermission.entityId} item xs>
              <FormControl variant="outlined" sx={{minWidth: 120}}>
                <InputLabel>{entityPermission.name}</InputLabel>
                <Select label={entityPermission.role} value={entityPermission.role}
                        onChange={(event) => handleChange(entityPermission, event)}>
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
                  <MenuItem value={PERMISSION_NONE}>
                    <Box component={"span"} mr={3}><FontAwesomeIcon icon={getPermissionIcon(PERMISSION_NONE)}/></Box>
                    <em>None</em>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
    </Box>);
}

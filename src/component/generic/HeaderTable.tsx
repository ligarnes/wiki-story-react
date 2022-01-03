import React, {FunctionComponent, ReactNode} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

export interface Data {
  id: string;

  [index: string]: string | ReactNode;
}

export interface Props {
  columns: Array<Column>;
  datas: Array<Data>;
}

function generateCell(column: Column, row: Data) {
  const value = row[column.id];
  return (<TableCell key={column.id} align={column.align}> {value} </TableCell>);
}

function generateRow(columns: Array<Column>, row: Data) {

  const cells = columns.map((column) => generateCell(column, row));
  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
      {cells}
    </TableRow>
  );
}

/**
 * The Asset event info card component.
 *
 * @param {Props} props the properties
 * @constructor
 */
export const HeaderTable: FunctionComponent<Props> = (props: Props) => {

  return (
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {props.columns.map((column) => (
              <TableCell key={column.id} align={column.align} style={{minWidth: column.minWidth}}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.datas.map(row => generateRow(props.columns, row))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

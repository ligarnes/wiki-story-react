import React, {FunctionComponent, useState} from "react";
import {Box, Button, ButtonGroup, Grid, Paper, Typography} from "@material-ui/core";
import {newDefaultWiki, WikiMinimal, WikiMinimalCreate} from "../../model/Wiki";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEye, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {getApplication} from "../../Application";
import {Page} from "../../model/Model";
import {useHistory} from "react-router";
import {Column, HeaderTable} from "../generic/HeaderTable";
import {Pagination} from "@material-ui/lab";
import FormDialog from "../generic/FormDialog";
import {CreateWikiForm} from "./form/CreateWikiForm";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  deleteBtn: {
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.dark
  },
}));

interface WikiActionsProps {
  onWikiSelect: () => void;
  onWikiDelete: () => void;
}

const WikiActions: FunctionComponent<WikiActionsProps> = (props: WikiActionsProps) => {
  const classes = useStyles();
  return <Grid container spacing={0}>
    <ButtonGroup size="small" aria-label="small button group">
      <Button color="primary" onClick={props.onWikiSelect}><FontAwesomeIcon icon={faEye}/></Button>
      <Button className={classes.deleteBtn} onClick={props.onWikiDelete}><FontAwesomeIcon icon={faTrashAlt}/></Button>
    </ButtonGroup>
  </Grid>
}

function convertWiki(wiki: WikiMinimal, onWikiSelect: () => void) {

  const onWikiDelete = () => {
    getApplication().serviceLocator.wikiService.delete(wiki.id)
      .then(() => getApplication().notificationManager.successNotification(`Wiki ${wiki.id} was deleted successfully`))
      .catch(() => getApplication().notificationManager.errorNotification(`Failed to delete Wiki ${wiki.id}`));
  }

  return {
    id: wiki.id,
    title: wiki.title,
    actions: (<WikiActions onWikiSelect={onWikiSelect} onWikiDelete={onWikiDelete}/>)
  };
}

export interface Props {
  page: Page<WikiMinimal>;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export const WikiList: FunctionComponent<Props> = (props: Props) => {

  const history = useHistory();

  const {page} = props;

  const [createOpen, setCreateOpen] = useState(false);
  const [wiki, setWiki] = useState(newDefaultWiki());

  const columns: Array<Column> = [{id: "title", label: "Title"},
    {id: "actions", label: "Actions", align: 'center'}];
  const datas = page.datas.map((wiki: WikiMinimal) => convertWiki(wiki, () => history.push(`/wiki/${wiki.id}/`)));

  const onWikiCreate = () => {
    getApplication().serviceLocator.wikiService.createWiki(wiki)
      .then(() => getApplication().notificationManager.successNotification("WikiMinimal created"))
      .catch((reason: any) => getApplication().notificationManager.errorNotification(["Failed to create a new wiki", reason]))
      .finally(() => setWiki(newDefaultWiki()));
    setCreateOpen(false);
  }

  const onCancel = () => {
    setWiki(newDefaultWiki())
    setCreateOpen(false);
  }

  const onNewWiki = () => {
    setCreateOpen(true);
  }

  const onChange = (newWiki: WikiMinimalCreate) => {
    setWiki(newWiki);
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2" align="center">My Wiki Story</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={onNewWiki}> New Wiki </Button>
        </Grid>
        <Grid item xs={12}>
          <Box component={Paper}>
            <HeaderTable columns={columns} datas={datas}/>
          </Box>
          <Box display="flex" component={Paper} pt={1} pb={1} mt={1} justifyContent="center">
            <Pagination count={page.totalPage} page={page.currentPage} onChange={props.onPageChange}/>
          </Box>
        </Grid>
      </Grid>
      <div>
        <FormDialog open={createOpen} title="Create Wiki" createHandler={onWikiCreate} cancelHandler={onCancel}>
          <CreateWikiForm wiki={wiki} onChange={onChange}/>
        </FormDialog>
      </div>
    </>);
}

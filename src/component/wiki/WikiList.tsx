import React, {FunctionComponent, useEffect, useState} from "react";
import {Box, Button, ButtonGroup, Grid, Pagination, Paper, Typography} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEye, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {Page} from "../../model/Model";
import {useHistory} from "react-router";
import {Column, HeaderTable} from "../generic/HeaderTable";
import FormDialog from "../generic/FormDialog";
import {CreateWikiForm} from "./form/CreateWikiForm";
import {emptyWikiInfo, emptyWikiInfoCreate, newWikiInfoCreate, WikiInfo, WikiInfoCreate} from "../../model/v2/Wiki";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {serviceLocatorAtom} from "../../atom/ServiceLocatorAtom";
import {addNotificationSelector} from "../../atom/NotificationAtom";
import {userAtom} from "../../atom/UserAtom";
import {red} from "@mui/material/colors";

interface WikiActionsProps {
  onWikiSelect: () => void;
  onWikiDelete: () => void;
}

const WikiActions: FunctionComponent<WikiActionsProps> = (props: WikiActionsProps) => {
  return <Grid container spacing={0}>
    <ButtonGroup size="small" aria-label="small button group">
      <Button color="primary" variant="contained" onClick={props.onWikiSelect}>
        <FontAwesomeIcon icon={faEye}/>
      </Button>
      <Button sx={{backgroundColor: red[900]}} variant="contained" onClick={props.onWikiDelete}>
        <FontAwesomeIcon icon={faTrashAlt}/>
      </Button>
    </ButtonGroup>
  </Grid>
}

export interface Props {
  page: Page<WikiInfo>;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onDataChanged: () => void;
}

export const WikiList: FunctionComponent<Props> = (props: Props) => {

  const history = useHistory();

  const {page} = props;

  const [createOpen, setCreateOpen] = useState(false);
  const user = useRecoilValue(userAtom);
  const [wikiCreate, setWikiCreate] = useState(emptyWikiInfoCreate());

  const serviceLocator = useRecoilValue(serviceLocatorAtom);
  const addNotification = useSetRecoilState(addNotificationSelector);

  useEffect(() => {
    setWikiCreate(newWikiInfoCreate(user));
  }, [user])

  const convertWiki = (wiki: WikiInfo, onWikiSelect: () => void) => {
    const onWikiDelete = () => {
      serviceLocator?.wikiService.delete(wiki.id)
        .then(() => addNotification({
          title: "Deleted",
          text: `Wiki ${wiki.title} was deleted successfully`,
          severity: "success"
        }))
        .catch((reason: any) => addNotification({
          title: "Error",
          text: `Failed to delete Wiki ${wiki.title}`,
          severity: "error"
        }));
      props.onDataChanged();
    }

    return {
      id: wiki.id,
      title: wiki.title,
      actions: (<WikiActions onWikiSelect={onWikiSelect} onWikiDelete={onWikiDelete}/>)
    };
  }

  const columns: Array<Column> = [{id: "title", label: "Title"}, {id: "actions", label: "Actions", align: 'center'}];
  const datas = page.datas.map((wiki: WikiInfo) => convertWiki(wiki, () => history.push(`/wiki/${wiki.id}/`)));

  const onWikiCreate = () => {
    serviceLocator?.wikiService.createWiki(wikiCreate)
      .then(() => addNotification({title: "Created", text: "Wiki created", severity: "success"}))
      .catch((reason: any) => addNotification({title: "Error", text: "Failed to create a new wiki", severity: "error"}))
    setCreateOpen(false);
    props.onDataChanged();
  }

  const onCancel = () => {
    setWikiCreate(emptyWikiInfo())
    setCreateOpen(false);
  }

  const onNewWiki = () => {
    setCreateOpen(true);
  }

  const onChange = (newWiki: WikiInfoCreate) => {
    setWikiCreate(newWiki);
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
          <CreateWikiForm wiki={wikiCreate} onChange={onChange}/>
        </FormDialog>
      </div>
    </>);
}

import React, {FunctionComponent, useEffect, useState} from "react";
import {getApplication} from "../Application";
import {WikiMinimal} from "../model/Wiki";
import {Page} from "../model/Model";
import {WikiList} from "./wiki/WikiList";

export const WikiListPage: FunctionComponent<unknown> = () => {
  const [wikis, setWikis] = useState({currentPage: 1, totalPage: 1, datas: []} as Page<WikiMinimal>);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getApplication().serviceLocator.wikiService.listWiki(currentPage, 10)
      .then((page) => {
        setLoading(false);
        setWikis(page);
      })
      .catch(e => {
        setHasError(true)
        setLoading(false);
        getApplication().notificationManager.errorNotification(['Failed to retrieved the wikis', e]);
      });
  }, [currentPage]);

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <>
      {loading ? <div>Loading...</div> :
        hasError ? <div>Error occurred.</div> :
          <>
            <WikiList page={wikis} onPageChange={changePage}/>
          </>}
    </>
  );
}

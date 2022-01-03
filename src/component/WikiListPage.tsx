import React, {FunctionComponent, useEffect, useState} from "react";
import {Page} from "../model/Model";
import {WikiList} from "./wiki/WikiList";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {serviceLocatorAtom} from "../atom/ServiceLocatorAtom";
import {WikiInfo} from "../model/v2/Wiki";
import {addNotificationSelector} from "../atom/NotificationAtom";

export const WikiListPage: FunctionComponent<unknown> = () => {
  const [wikis, setWikis] = useState({currentPage: 1, totalPage: 1, datas: []} as Page<WikiInfo>);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const serviceLocator = useRecoilValue(serviceLocatorAtom);
  const addNotification = useSetRecoilState(addNotificationSelector);

  useEffect(() => {
    serviceLocator?.wikiService.listWiki(currentPage, 10)
      .then((page) => {
        setLoading(false);
        setWikis(page);
      })
      .catch(() => {
        setLoading(false);
        addNotification({severity: "error", title: "Error", text: "Failed to retrieved the wikis"});
      });
  }, [serviceLocator, loading, currentPage, addNotification]);

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const onDataChanged = () => {
    setLoading(true);
  };

  return (
    <>
      {loading ? <div>Loading...</div> :
        <>
          <WikiList page={wikis} onPageChange={changePage} onDataChanged={onDataChanged}/>
        </>}
    </>
  );
}

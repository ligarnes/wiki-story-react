import {useRecoilState, useRecoilValue} from "recoil";
import {useEffect} from "react";
import {serviceLocatorAtom} from "../atom/ServiceLocatorAtom";
import {wikiAtom, wikiIdAtom, wikiNeedRefreshAtom} from "../atom/WikiAtom";

function isSame(data1: unknown, data2: unknown) {
  const str1 = JSON.stringify(data1);
  const str2 = JSON.stringify(data2);
  return str1 === str2;
}

export function WikiSync() {
  const serviceLocator = useRecoilValue(serviceLocatorAtom);
  const wikiId = useRecoilValue(wikiIdAtom);
  const [wiki, setWiki] = useRecoilState(wikiAtom);
  const [wikiNeedRefresh, setWikiNeedRefresh] = useRecoilState(wikiNeedRefreshAtom);

  useEffect(() => {
    if (wikiId && serviceLocator && wikiNeedRefresh) {
      serviceLocator.wikiService.getWiki(wikiId).then(newWiki => {
        if (!isSame(wiki, newWiki)) {
          setWiki(newWiki);
        }
      });
      setWikiNeedRefresh(false);
    }
  }, [serviceLocator, wikiId, setWiki, wikiNeedRefresh, setWikiNeedRefresh, wiki]);

  useEffect(() => {
    // Refresh every 10 sec if needed.
    const interval = setInterval(() => setWikiNeedRefresh(true), 10000);
    return () => clearInterval(interval);
  }, [setWikiNeedRefresh]);

  return (<></>);
}
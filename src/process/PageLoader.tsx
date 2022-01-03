import {useRecoilValue, useSetRecoilState} from "recoil";
import {articleAtom, articleIdAtom} from "../atom/ArticleAtom";
import {useEffect} from "react";
import {serviceLocatorAtom} from "../atom/ServiceLocatorAtom";
import {wikiIdAtom} from "../atom/WikiAtom";
import {addNotificationSelector} from "../atom/NotificationAtom";

export function PageLoader() {
  const serviceLocator = useRecoilValue(serviceLocatorAtom);
  const wikiId = useRecoilValue(wikiIdAtom);
  const articleId = useRecoilValue(articleIdAtom);
  const setArticle = useSetRecoilState(articleAtom);
  const addNotification = useSetRecoilState(addNotificationSelector);

  useEffect(() => {
    if (wikiId && articleId) {
      serviceLocator?.articleService.getArticle(wikiId, articleId).then(article => setArticle(article))
        .catch(err => {
          addNotification({severity: "error", title: "Error", text: `Failed to retrieve the data of ${articleId}`});
        });
    }
  }, [serviceLocator, wikiId, articleId, setArticle, addNotification]);

  return (<></>);
}
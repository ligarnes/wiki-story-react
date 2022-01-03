import {atom, selector} from "recoil";
import {Article, emptyArticle} from "../model/v2/Article";
import {wikiAtom} from "./WikiAtom";
import {DocumentDescription} from "../model/v2/Wiki";

export const articleIdAtom = atom<string | undefined>({
  key: 'articleId',
  default: undefined,
});

export const articleAtom = atom<Article>({
  key: 'article',
  default: emptyArticle(),
});

export const articleInfoSelector = selector<DocumentDescription>({
  key: '',
  get: ({get}) => {
    const wiki = get(wikiAtom);
    const articleId = get(articleIdAtom);
    let page = wiki.pages.find(page => page.documentId === articleId);
    if (!page) {
      page = {
        title: "unknown",
        documentId: "",
        documentType: "",
        permission: {admins: [], writes: [], reads: []}
      } as DocumentDescription;
    }

    return page;
  }
});
import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, useParams} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import theme from "./theme/theme";
import {ExternalTemplateView} from "./view/template/ExternalView";
import {Login} from "./view/external/Login";
import {Signin} from "./view/external/Signin";
import {UserTemplateView} from "./view/template/logged/UserTemplateView";
import {Dashboard} from "./view/user/Dashboard";
import {WikiTemplateView} from "./view/template/logged/WikiTemplateView";
import {ArticleView} from "./view/wiki/ArticleView";
import {ArticleEdit} from "./view/wiki/ArticleEdit";
import {MyProfile} from "./view/user/MyProfile";
import {WikiDashboard} from "./view/wiki/WikiDashboard";
import {WikiJoinView} from "./view/wiki/WikiJoinView";
import './i18n';
import {RecoilRoot, useRecoilState} from "recoil";
import {App} from "./App";
import {wikiIdAtom} from "./atom/WikiAtom";
import {articleIdAtom} from "./atom/ArticleAtom";
import {CssBaseline, ThemeProvider} from "@mui/material";

ReactDOM.render(
  <RecoilRoot>
    <App/>
    <React.StrictMode>
      <BrowserRouter forceRefresh={true} keyLength={20}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Switch>
            <Route exact path="/login" component={loginPage}/>
            <Route exact path="/signin" component={signin}/>
            <Route exact path="/my-profile" component={myProfile}/>
            <Route exact path="/my-wikis" component={dashboard}/>
            <Route exact path="/wiki/:wikiId/" component={Welcome}/>
            <Route exact path="/wiki/:wikiId/join/:invitationKey" component={JoinWiki}/>
            <Route exact path="/wiki/:wikiId/article/:articleId" component={Article}/>
            <Route exact path="/wiki/:wikiId/article/:articleId/edit" component={ArticleEditPage}/>
            <Route exact path="/*" component={loginPage}/>
          </Switch>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  </RecoilRoot>
  , document.getElementById("root")
);

function loginPage() {
  return (<ExternalTemplateView><Login/></ExternalTemplateView>)
}

function signin() {
  return (<ExternalTemplateView><Signin/></ExternalTemplateView>)
}

function dashboard() {
  return (<UserTemplateView><Dashboard/></UserTemplateView>)
}

function myProfile() {
  return (<UserTemplateView><MyProfile/></UserTemplateView>)
}

function Welcome() {
  let {wikiId} = useParams<{ wikiId: string }>();
  const [currentId, setWikiId] = useRecoilState(wikiIdAtom);

  useEffect(() => {
    if (currentId !== wikiId) {
      setWikiId(wikiId);
    }
  }, [wikiId, setWikiId, currentId]);

  return (<WikiTemplateView><WikiDashboard/></WikiTemplateView>)
}

function JoinWiki() {
  let {wikiId, invitationKey} = useParams<{ wikiId: string, invitationKey: string }>();

  return (<UserTemplateView><WikiJoinView wikiId={wikiId} invitationKey={invitationKey}/></UserTemplateView>)
}

function Article() {
  const {articleId, wikiId} = useParams<{ articleId?: string, wikiId?: string }>();

  const [currentId, setWikiId] = useRecoilState(wikiIdAtom);
  const [currentArticleId, setArticleId] = useRecoilState(articleIdAtom);

  useEffect(() => {
    if (wikiId && currentId !== wikiId) {
      setWikiId(wikiId);
    }
    if (articleId && currentArticleId !== articleId) {
      setArticleId(articleId);
    }
  }, [articleId, currentArticleId, currentId, setArticleId, setWikiId, wikiId]);

  return (<WikiTemplateView><ArticleView/></WikiTemplateView>)
}

function ArticleEditPage() {
  let {articleId, wikiId} = useParams<{ articleId: string, wikiId: string }>();
  const [currentId, setWikiId] = useRecoilState(wikiIdAtom);
  const [currentArticleId, setArticleId] = useRecoilState(articleIdAtom);

  useEffect(() => {
    if (currentId !== wikiId) {
      setWikiId(wikiId);
    }
    if (currentArticleId !== articleId) {
      setArticleId(articleId);
    }
  }, [articleId, currentArticleId, currentId, setArticleId, setWikiId, wikiId]);

  return (<WikiTemplateView><ArticleEdit/></WikiTemplateView>)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, {FunctionComponent} from "react";
import {Typography} from "@material-ui/core";
import {ParagraphContentComponent} from "./ParagraphContentComponent";
import {Content, ParagraphContent} from "../../../../model/ArticleContent";


export interface Props {
  content: Content;
}

export const ContentFactory: FunctionComponent<Props> = (props: Props) => {

  const {content} = props;

  if (content.type === "ParagraphContent") {
    return (<ParagraphContentComponent content={content as ParagraphContent}/>);
  }

  return (
    <>
      <Typography>unsupported content of type {content.type}</Typography>
    </>);
}

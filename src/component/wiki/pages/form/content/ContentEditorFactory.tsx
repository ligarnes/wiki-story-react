import React, {FunctionComponent} from "react";
import {Typography} from "@mui/material";
import {ParagraphContentForm} from "./ParagraphContentForm";
import {Content, ParagraphContent} from "../../../../../model/ArticleContent";


export interface Props {
  content: Content;
  onChange: (newContent: Content) => void;
}

export const ContentEditorFactory: FunctionComponent<Props> = (props: Props) => {

  const {content} = props;

  if (content.type === "ParagraphContent") {
    return (<ParagraphContentForm content={content as ParagraphContent} onChange={props.onChange}/>);
  }

  return (
    <>
      <Typography>unsupported content of type {content.type}</Typography>
    </>);
}

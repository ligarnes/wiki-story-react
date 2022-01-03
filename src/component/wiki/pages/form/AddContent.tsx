import React, {FunctionComponent} from "react";
import ReactMarkdown from "react-markdown"
import {Box} from "@mui/material";
import {ParagraphContent} from "../../../../model/ArticleContent";


export interface Props {
  content: ParagraphContent;
}

export const AddContentComponent: FunctionComponent<Props> = (props: Props) => {

  const {content} = props;

  return (
    <>
      <Box>
        <ReactMarkdown>
          {content.text}
        </ReactMarkdown>
      </Box>
    </>);
}

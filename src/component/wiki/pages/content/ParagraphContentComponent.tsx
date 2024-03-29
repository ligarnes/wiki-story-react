import React, {FunctionComponent} from "react";
import ReactMarkdown from "react-markdown"
import {Box, Paper} from "@material-ui/core";
import {ParagraphContent} from "../../../../model/ArticleContent";
import {components} from "../../../generic/markdown/ImageExtensionRenderer";


export interface Props {
  content: ParagraphContent;
}

export const ParagraphContentComponent: FunctionComponent<Props> = (props: Props) => {

  const {content} = props;

  return (
    <>
      <Box component={Paper} m={2} p={2}>
        <ReactMarkdown components={components}>
          {content.text}
        </ReactMarkdown>
      </Box>
    </>);
}

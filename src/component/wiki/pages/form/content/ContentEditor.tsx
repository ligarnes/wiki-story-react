import React, {FunctionComponent} from "react";
import {Box, Button, IconButton, Paper} from "@mui/material";
import {ContentEditorFactory} from "./ContentEditorFactory";
import {Content, newParagraph} from "../../../../../model/ArticleContent";
import {Delete} from "@mui/icons-material";


export interface Props {
  contentList: Array<Content>;
  onChange: (contents: Array<Content>) => void;
}

export const ContentEditor: FunctionComponent<Props> = (props: Props) => {

  const {contentList} = props;

  const onChange = (idx: number, content: Content) => {
    const newList = [...contentList];
    newList[idx] = content;
    props.onChange(newList);
  }

  const addSection = () => props.onChange([...contentList, newParagraph()]);
  const removeSection = (idx: number) => props.onChange(contentList.splice(idx, 1))

  return (
    <>
      <Box>
        {contentList.map((c: Content, idx: number) => (
          <Box key={`article-content-${idx}`} component={Paper} m={2} p={2}>
            <Box mb={1} display="flex" justifyContent="flex-end">
              <IconButton aria-label="delete" color="secondary" size="small" onClick={() => removeSection(idx)}>
                <Delete/>
              </IconButton>
            </Box>
            <ContentEditorFactory content={c} onChange={(content) => onChange(idx, content)}/>
          </Box>)
        )}
      </Box>
      <Box>
        <Box component={Paper} m={2} p={2}>
          <Button variant="contained" color="primary" onClick={addSection}>
            Add content
          </Button>
        </Box>
      </Box>
    </>);
}

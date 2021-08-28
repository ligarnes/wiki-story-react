import React, {FunctionComponent, useEffect} from "react";
import MDEditor from '@uiw/react-md-editor';
import {ParagraphContent} from "../../../../../model/ArticleContent";


export interface Props {
  content: ParagraphContent;
  onChange: (newContent: ParagraphContent) => void;
}

export const ParagraphContentForm: FunctionComponent<Props> = (props: Props) => {

  const {content} = props;
  const [value, setValue] = React.useState("");
  useEffect(() => {
    setValue(content.text);
  }, [content]);

  const changeText = (value?: string) => {
    if (value) {
      setValue(value);
      props.onChange({...content, text: value});
    } else {
      setValue("");
      props.onChange({...content, text: ""});
    }
  }

  return (
    <>
      <MDEditor height={200} value={value} onChange={changeText}/>
    </>);
}

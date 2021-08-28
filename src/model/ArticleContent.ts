export function newParagraph(): ParagraphContent {
  return {
    type: "ParagraphContent",
    text: ""
  }
}

export interface Content {
  type: string;
}

export interface ParagraphContent extends Content {
  text: string;
}

export interface MarkdownContent extends Content {
  markdown: string;
}
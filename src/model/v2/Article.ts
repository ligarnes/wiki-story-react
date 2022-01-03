export interface Article {
  documentId: string;
  title: string;
  documentType: string;
  version: number;
  sections: Content[];
}

export interface Content {
  type: string;
}

export interface ParagraphContent extends Content {
  text: string;
}


export function emptyArticle() {
  return {
    title: "",
    documentId: "",
    documentType: "",
    version: 0,
    sections: []
  };
}
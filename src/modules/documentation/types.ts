export interface DocSection {
  id: string;
  title: string;
}

export interface DocumentationTopic {
  id: string;
  title: string;
  icon: string;
  sections: DocSection[];
}

/** Reference list of the paper, numbered as in the text ([1], [2]...). */
export interface Reference {
  n: number;
  text: string;
  url?: string;
}

export const REFERENCES: Reference[] = [
  // filled by the content prompts
];

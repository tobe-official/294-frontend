export interface CheatsheetRecord {
  id: string;
  title: string;
  description: string;
  uploader: string;     // RELATION_RECORD_ID
  stars: number;
  thumbnail: string;    // filename (e.g. "abc123_thumbnail.png")
  pdf: string;          // filename (e.g. "def456_document.pdf")
  created: string;      // ISO date string
  updated: string;      // ISO date string
}

export interface Cheatsheet {
  title: string;
  description: string;
  pdfUrl: string;
  // RELATION_RECORD_ID
  uploader: string | undefined;
  thumbnailUrl: string;
}

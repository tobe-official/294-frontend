export interface Cheatsheet {
  title: string;
  description: string;
  pdfUrl: string;
  price: number;
  // RELATION_RECORD_ID
  uploader: string | undefined;
  thumbnailUrl: string;
  stars: number;
}

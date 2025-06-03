export interface CheatsheetCreatePayload {
  title: string;
  description: string;
  uploader: string;   // RELATION_RECORD_ID
  stars: number;
  thumbnail: File;    // Browser File from <input type="file">
  pdf: File;          // Browser File (must be application/pdf)
}

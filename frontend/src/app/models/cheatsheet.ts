import { AuthRecord } from 'pocketbase';

export interface Cheatsheet {
  title: string;
  description: string;
  pdfUrl: string;
  uploader: AuthRecord;
}

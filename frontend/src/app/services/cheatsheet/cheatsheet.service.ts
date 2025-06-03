import { Injectable } from '@angular/core';
import PocketBase, { ListResult, RecordModel } from 'pocketbase';
import { CheatsheetCreatePayload } from '../../models/CheatsheetCreatePayload';

@Injectable({
  providedIn: 'root',
})
export class CheatsheetService {
  private pb: PocketBase = new PocketBase('http://localhost:8090');

  constructor() {}

  /**
   * Creates a new cheatsheet record in PocketBase.
   * Builds a FormData object from CheatsheetCreatePayload so that thumbnail/pdf
   * are sent as actual file uploads (multipart/form-data).
   *
   * @param payload  The new cheatsheet data, including two File objects.
   * @returns        The created PocketBase RecordModel (with thumbnail/pdf as filenames).
   */
  public async create(
    payload: CheatsheetCreatePayload
  ): Promise<RecordModel | null> {
    if (!payload) {
      throw new Error('invalid cheatsheet payload');
    }

    // Build FormData to satisfy PocketBase JS SDK’s multipart/form-data requirement
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('uploader', payload.uploader);
    formData.append('stars', payload.stars.toString());
    formData.append('thumbnail', payload.thumbnail); // single‐file field
    formData.append('pdf', payload.pdf);             // single‐file field

    // The JS SDK will detect FormData and send multipart/form-data automatically.
    return this.pb.collection('cheatsheets').create(formData);
  }

  /**
   * Fetches *all* cheatsheets (no paging) as an array of RecordModel.
   */
  public getAllCheatsheets(): Promise<RecordModel[]> {
    return this.pb.collection('cheatsheets').getFullList();
  }

  /**
   * Fetches the top 4 cheatsheets (page 1, limit 4), sorted descending by “stars.”
   */
  public async getTopFourCheatSheets(): Promise<ListResult<RecordModel>> {
    return this.pb
      .collection('cheatsheets')
      .getList(1, 4, { sort: '-stars' });
  }

  /**
   * Given a RecordModel, returns the full URL to download/display the thumbnail.
   * PocketBase will take care of signing the URL if needed.
   *
   * @param record  A RecordModel (must have record.thumbnail as a string).
   * @returns       A URL string (e.g. "http://localhost:8090/api/files/cheatsheets/RECORD_ID/abcdef_thumbnail.png")
   */
  public getThumbnailUrl(record: RecordModel): string {
    // `record.thumbnail` is the filename stored on the server.
    return this.pb.getFileUrl(record, record['thumbnail'] as string);
  }

  /**
   * Same as above, but returns the URL for the PDF file.
   */
  public getPdfUrl(record: RecordModel): string {
    return this.pb.getFileUrl(record, record['pdf'] as string);
  }
}

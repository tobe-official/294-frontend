import { TestBed } from '@angular/core/testing';

import { CheatsheetService } from './cheatsheet.service';

describe('CheatsheetService', () => {
  let service: CheatsheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheatsheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

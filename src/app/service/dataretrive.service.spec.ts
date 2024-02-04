import { TestBed } from '@angular/core/testing';

import { DataretriveService } from './dataretrive.service';

describe('DataretriveService', () => {
  let service: DataretriveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataretriveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

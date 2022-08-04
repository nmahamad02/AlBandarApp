import { TestBed } from '@angular/core/testing';

import { ExportagreementService } from './exportagreement.service';

describe('ExportagreementService', () => {
  let service: ExportagreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportagreementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ClubserivceService } from './clubserivce.service';

describe('ClubserivceService', () => {
  let service: ClubserivceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubserivceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

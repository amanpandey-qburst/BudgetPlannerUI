import { TestBed } from '@angular/core/testing';

import { CompareplanService } from './compareplan.service';

describe('CompareplanService', () => {
  let service: CompareplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompareplanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

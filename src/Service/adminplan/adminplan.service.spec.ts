import { TestBed } from '@angular/core/testing';

import { AdminplanService } from './adminplan.service';

describe('AdminplanService', () => {
  let service: AdminplanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminplanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

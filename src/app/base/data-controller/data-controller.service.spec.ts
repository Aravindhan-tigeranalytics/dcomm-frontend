import { TestBed } from '@angular/core/testing';

import { DataControllerService } from './data-controller.service';

describe('DataControllerService', () => {
  let service: DataControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

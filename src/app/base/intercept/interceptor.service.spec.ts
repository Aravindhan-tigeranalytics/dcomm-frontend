import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { InterceptorService } from './interceptor.service';

describe('InterceptorService', () => {
  let service: InterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
    });
    service = TestBed.inject(InterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

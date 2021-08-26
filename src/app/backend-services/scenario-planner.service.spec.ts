import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScenarioPlannerService } from './scenario-planner.service';

describe('ScenarioPlannerService', () => {
  let service: ScenarioPlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],});
    service = TestBed.inject(ScenarioPlannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

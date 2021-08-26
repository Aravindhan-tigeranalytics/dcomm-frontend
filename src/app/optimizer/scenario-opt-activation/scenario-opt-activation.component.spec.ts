import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ScenarioOptActivationComponent } from './scenario-opt-activation.component';

describe('ScenarioOptActivationComponent', () => {
  let component: ScenarioOptActivationComponent;
  let fixture: ComponentFixture<ScenarioOptActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ ScenarioOptActivationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioOptActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioOptActivationComponent } from './scenario-opt-activation.component';

describe('ScenarioOptActivationComponent', () => {
  let component: ScenarioOptActivationComponent;
  let fixture: ComponentFixture<ScenarioOptActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

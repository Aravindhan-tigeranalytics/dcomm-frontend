import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioSimActivationComponent } from './scenario-sim-activation.component';

describe('ScenarioSimActivationComponent', () => {
  let component: ScenarioSimActivationComponent;
  let fixture: ComponentFixture<ScenarioSimActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioSimActivationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioSimActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

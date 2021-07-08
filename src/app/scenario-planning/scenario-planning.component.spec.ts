import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioPlanningComponent } from './scenario-planning.component';

describe('ScenarioPlanningComponent', () => {
  let component: ScenarioPlanningComponent;
  let fixture: ComponentFixture<ScenarioPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioPlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

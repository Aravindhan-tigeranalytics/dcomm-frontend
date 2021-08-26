import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioBarchartComponent } from './scenario-barchart.component';

describe('ScenarioBarchartComponent', () => {
  let component: ScenarioBarchartComponent;
  let fixture: ComponentFixture<ScenarioBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioBarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

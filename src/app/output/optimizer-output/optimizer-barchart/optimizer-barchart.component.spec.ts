import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizerBarchartComponent } from './optimizer-barchart.component';

describe('OptimizerBarchartComponent', () => {
  let component: OptimizerBarchartComponent;
  let fixture: ComponentFixture<OptimizerBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptimizerBarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizerBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

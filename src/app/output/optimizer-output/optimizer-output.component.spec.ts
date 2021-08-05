import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizerOutputComponent } from './optimizer-output.component';

describe('OptimizerOutputComponent', () => {
  let component: OptimizerOutputComponent;
  let fixture: ComponentFixture<OptimizerOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptimizerOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizerOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

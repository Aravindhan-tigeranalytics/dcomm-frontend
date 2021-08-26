import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptimizerOutputComponent } from './optimizer-output.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ShortNumberPipe } from 'src/app/base/pipes/short-number.pipe';

describe('OptimizerOutputComponent', () => {
  let component: OptimizerOutputComponent;
  let fixture: ComponentFixture<OptimizerOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,ShortNumberPipe],
      declarations: [ OptimizerOutputComponent,
        ShortNumberPipe ]
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

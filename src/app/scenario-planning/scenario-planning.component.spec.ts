import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioPlanningComponent } from './scenario-planning.component';

describe('ScenarioPlanningComponent', () => {
  let component: ScenarioPlanningComponent;
  let fixture: ComponentFixture<ScenarioPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
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
  it('should creates', () => {
    fixture = TestBed.createComponent(ScenarioPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let value={discount:10}
    let out=component.decrementRange(value);
    expect(out==5).toBeTruthy();

  });
});

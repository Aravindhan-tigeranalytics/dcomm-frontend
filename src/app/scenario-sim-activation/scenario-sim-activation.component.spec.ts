import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioSimActivationComponent } from './scenario-sim-activation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('ScenarioSimActivationComponent', () => {
  let component: ScenarioSimActivationComponent;
  let fixture: ComponentFixture<ScenarioSimActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([]),
    ],
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

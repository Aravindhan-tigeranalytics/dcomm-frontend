
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioComponent } from './scenario/scenario.component';
import { ScenarioPlanningComponent } from './scenario-planning/scenario-planning.component';
import { ScenarioOutputComponent } from '../scenario-output/scenario-output.component';
import { ScenarioSimActivationComponent } from './scenario-sim-activation/scenario-sim-activation.component';

const routes: Routes = [
   { path: '', component: ScenarioPlanningComponent, },
   { path: 'plan-activation', component: ScenarioSimActivationComponent },
   { path: 'scenarioresult', component: ScenarioOutputComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulatorRoutingModule { }
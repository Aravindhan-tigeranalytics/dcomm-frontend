import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioPlanningComponent } from './scenario-planning/scenario-planning.component';

const routes: Routes = [
  { path: '', component: ScenarioPlanningComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule { }

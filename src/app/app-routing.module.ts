import { ScenarioPlanningComponent } from './scenario-planning/scenario-planning.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioComponent } from '../app/scenario/scenario.component';
import { ScenarioOutputComponent } from './scenario-output/scenario-output.component';


const routes: Routes = [
  { path: '', component: ScenarioPlanningComponent },
  { path: 'scenarioresult', component: ScenarioOutputComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

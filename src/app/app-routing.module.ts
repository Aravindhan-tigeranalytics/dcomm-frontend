import { ScenarioPlanningComponent } from './scenario-planning/scenario-planning.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioComponent } from '../app/scenario/scenario.component';
import { ScenarioOutputComponent } from './scenario-output/scenario-output.component';
import { ScenarioSimActivationComponent } from './scenario-sim-activation/scenario-sim-activation.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', component: ScenarioPlanningComponent, },
  { path: 'plan-activation', component: ScenarioSimActivationComponent },
  { path: 'scenarioresult', component: ScenarioOutputComponent },
  { path: 'login', component: LoginComponent },
  { path: 'optimizer', loadChildren: () => import('./optimizer/optimizer.module').then(m => m.OptimizerModule) },
 // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

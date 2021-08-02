import { ScenarioPlanningComponent } from './planner/scenario-planning/scenario-planning.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioOutputComponent } from './scenario-output/scenario-output.component';
import { ScenarioSimActivationComponent } from './simulator/scenario-sim-activation/scenario-sim-activation.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'planner', loadChildren: () => import('./planner/planner.module').then(m => m.PlannerModule) },
  { path: 'simulator', loadChildren: () => import('./simulator/simulator.module').then(m => m.SimulatorModule) },
  { path: 'optimizer', loadChildren: () => import('./optimizer/optimizer.module').then(m => m.OptimizerModule) },
 // otherwise redirect to home
 { path: 'scenarioresult', component: ScenarioOutputComponent },
  { path: '**', redirectTo: 'planner' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

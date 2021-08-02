import { ScenarioPlanningComponent } from './planner/scenario-planning/scenario-planning.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: 'login', loadChildren: () => import('./base/base.module').then(m => m.BaseModule) },
  { path: 'planner', component: ScenarioPlanningComponent},
  { path: 'simulator', loadChildren: () => import('./simulator/simulator.module').then(m => m.SimulatorModule) },
  { path: 'optimizer', loadChildren: () => import('./optimizer/optimizer.module').then(m => m.OptimizerModule) },
  { path: 'scenarioresult', loadChildren: () => import('./output/output.module').then(m => m.OutputModule) },
 // otherwise redirect to home
  { path: '**', redirectTo: 'planner' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

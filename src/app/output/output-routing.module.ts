import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptimizerOutputComponent } from './optimizer-output/optimizer-output.component';
import { ScenarioOutputComponent } from './scenario-output/scenario-output.component';

const routes: Routes = [
 { path: '', component: ScenarioOutputComponent },
 { path: 'optimizer', component: OptimizerOutputComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutputRoutingModule { }

import { ScenarioOptActivationComponent } from './scenario-opt-activation/scenario-opt-activation.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptimizerComponent } from './optimizer.component';

const routes: Routes = [{ path: '', component: ScenarioOptActivationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptimizerRoutingModule { }

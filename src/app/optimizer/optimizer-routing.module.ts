import { ScenarioOptActivationComponent } from './scenario-opt-activation/scenario-opt-activation.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptimizerComponent } from './optimizer.component';
import { OptimizerOutputComponent } from './optimizer-output/optimizer-output.component';

const routes: Routes = [{ path: '', component: ScenarioOptActivationComponent },
{ path: 'optimizerresult', component: OptimizerOutputComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptimizerRoutingModule { }

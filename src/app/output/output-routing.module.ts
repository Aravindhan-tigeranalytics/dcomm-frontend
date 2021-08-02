import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScenarioOutputComponent } from './scenario-output/scenario-output.component';

const routes: Routes = [
 { path: '', component: ScenarioOutputComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutputRoutingModule { }

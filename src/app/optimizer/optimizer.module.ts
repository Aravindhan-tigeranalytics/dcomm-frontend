import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { OptimizerRoutingModule } from './optimizer-routing.module';
import { OptimizerComponent } from './optimizer.component';
import { ScenarioOptActivationComponent } from './scenario-opt-activation/scenario-opt-activation.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OptimizerComponent,
    ScenarioOptActivationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    OptimizerRoutingModule,
    MaterialModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class OptimizerModule { }

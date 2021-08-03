import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { OptimizerRoutingModule } from './optimizer-routing.module';
import { OptimizerComponent } from './optimizer.component';
import { ScenarioOptActivationComponent } from './scenario-opt-activation/scenario-opt-activation.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { OptimizerOutputComponent } from './optimizer-output/optimizer-output.component';
import { BaseModule } from '../base/base.module';
@NgModule({
  declarations: [
    OptimizerComponent,
    ScenarioOptActivationComponent,
    OptimizerOutputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OptimizerRoutingModule,
    MaterialModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    BaseModule
  ]
})
export class OptimizerModule { }

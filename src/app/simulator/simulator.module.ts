
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../material.module';
import { SimulatorRoutingModule } from './simulator-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ScenarioComponent } from './scenario/scenario.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ScenarioComponent
  ],
  imports: [
    CommonModule,
    SimulatorRoutingModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    MatIconModule,
    MatCheckboxModule,
    NgxSliderModule,
    MatSelectModule,
    ReactiveFormsModule

  ]
})
export class SimulatorModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputRoutingModule } from './output-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../material.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OutputRoutingModule,
    FormsModule,
    MaterialModule,
    MatIconModule,
    MatCheckboxModule,
  //  NgxSliderModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class OutputModule { }

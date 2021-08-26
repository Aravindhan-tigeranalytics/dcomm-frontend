import { BaseModule } from './../base/base.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputRoutingModule } from './output-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../material.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({

  declarations: [

  ],
  imports: [
    CommonModule,
    OutputRoutingModule,
    FormsModule,
    MaterialModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    BaseModule,
    ChartsModule
  ],
  exports:[]

})
export class OutputModule { }

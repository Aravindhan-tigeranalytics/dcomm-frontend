import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRoutingModule } from './base-routing.module';
import { ShortNumberPipe } from './pipes/short-number.pipe';


@NgModule({
  declarations: [
    ShortNumberPipe
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,

  ],
  exports: [ShortNumberPipe],
})
export class BaseModule { }

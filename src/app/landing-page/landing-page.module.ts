import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    MatCheckboxModule,
    MaterialModule,
    MatIconModule,
  ]
})
export class LandingPageModule { }

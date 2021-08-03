
import { InterceptorService } from './base/intercept/interceptor.service';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './base/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScenarioPlanningComponent } from './planner/scenario-planning/scenario-planning.component';
import { ScenarioOutputComponent } from './output/scenario-output/scenario-output.component';
import { ScenarioBarchartComponent } from './output/scenario-output/scenario-barchart/scenario-barchart.component';
import { ChartsModule } from 'ng2-charts';
import { ScenarioSimActivationComponent } from './simulator/scenario-sim-activation/scenario-sim-activation.component';
import { LoginComponent } from './base/login/login.component';
import { BaseModule } from './base/base.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScenarioPlanningComponent,
    ScenarioOutputComponent,
    ScenarioBarchartComponent,
    ScenarioSimActivationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    NgbModule,
    ChartsModule,
    BaseModule,
    MatIconModule
  ],
  exports: [],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }},
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }

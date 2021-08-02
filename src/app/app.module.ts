
import { InterceptorService } from './intercept/interceptor.service';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import { ScenarioPlanningComponent } from './planner/scenario-planning/scenario-planning.component';
import { ScenarioOutputComponent } from './scenario-output/scenario-output.component';
import { ScenarioBarchartComponent } from './scenario-output/scenario-barchart/scenario-barchart.component';
import { ChartsModule } from 'ng2-charts';
import {MatMenuModule} from '@angular/material/menu';
import { ScenarioSimActivationComponent } from './simulator/scenario-sim-activation/scenario-sim-activation.component';
import { LoginComponent } from './login/login.component';
import { ShortNumberPipe } from './pipes/short-number.pipe';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScenarioPlanningComponent,
    ScenarioOutputComponent,
    ScenarioBarchartComponent,
    ScenarioSimActivationComponent,
    LoginComponent,
    ShortNumberPipe,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    NgxSliderModule,
    NgbModule,
    MatSortModule,
    ChartsModule,
    MatIconModule,
    MatMenuModule,

  ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }},
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

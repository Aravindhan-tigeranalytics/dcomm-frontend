import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as Notiflix from 'notiflix';
import { HtmlTagDefinition } from '@angular/compiler';
export interface ScenarioPlanner {
  pack_type: string;
  product_tpn: string;
  product_name: string;
  list_price: number;
  promotion_type: string;
  promotion_list: any[];
  promotion: string;
  discount: number;
  edlp: string;
  edlp_conversion: number;
}
export interface ScenarioPlannerConstraint {
  pack_type:string
  fsi: boolean;
  fai: boolean;
  search: boolean;
  sot: boolean;
  bpp: boolean;
}

@Component({
  selector: 'app-scenario-sim-activation',
  templateUrl: './scenario-sim-activation.component.html',
  styleUrls: ['./scenario-sim-activation.component.scss']
})

export class ScenarioSimActivationComponent implements OnInit {
  typeSelected:any = [];
  activityType: ScenarioPlanner[] = [];
  types = new FormControl();
  ELEMENT_DATA_CONSTRAINTS:any=[];
  Placements=['FSI','FAI','SEARCH','SOT','BBP'];
  PackTypes=['Mulipack','Baked','Pack'];
  displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  constructor(private routes:Router) {
    let input=this.routes.getCurrentNavigation()?.extras.state;
    if(input){
    if(typeof(input)!=undefined){
     this.ELEMENT_DATA_CONSTRAINTS=this.routes.getCurrentNavigation()?.extras.state;
      this.dataSourceConstraints=new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
      localStorage.setItem("defaultActivations", JSON.stringify(this.ELEMENT_DATA_CONSTRAINTS));
    }
    }else{
      this.ELEMENT_DATA_CONSTRAINTS=JSON.parse(localStorage.getItem('defaultActivations')|| '');
      this.dataSourceConstraints=new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
      //this.routes.navigate(['/']);
    }
   }

  ngOnInit(): void {

  }

  simulateScenario(){

    this.routes.navigate(['/scenarioresult'],{ state: this.ELEMENT_DATA_CONSTRAINTS });
    }
  go_back(){
    this.routes.navigate(['/'],{ state: this.ELEMENT_DATA_CONSTRAINTS });
    }
    selectAll(){
    this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any)=>{
        element.fsi=true;
        element.fai=true;
        element.search=true;
        element.sot=true;
        element.bpp=true;
    });
    }
    ResetAll(){
      this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any)=>{
        element.fsi=false;
        element.fai=false;
        element.search=false;
        element.sot=false;
        element.bpp=false;
    });
    }
}

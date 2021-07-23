import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConstraintObject, groupByJson } from 'src/app/scenario-planning/scenario-planning.component';
export interface ScenarioPlanner {
  pack_type: string;
  product_tpn: string;
  product_name: string;
  list_price: number;
  promotion_type: string;
  promotion_type_list:any[];
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
  selector: 'app-scenario-opt-activation',
  templateUrl: './scenario-opt-activation.component.html',
  styleUrls: ['./scenario-opt-activation.component.scss']
})
export class ScenarioOptActivationComponent  implements OnInit {
  typeSelected:any = [];
  activityType: ScenarioPlanner[] = [];
  types = new FormControl();
  ELEMENT_DATA_CONSTRAINTS:any=[];
  ELEMENT_DATA_CONSTRAINTS_MATRIX:any=[];
  Fav=[];
  selectedData:any=[];
  PROMOCODE_LIST:any={};
  Placements=['FSI','FAI','SEARCH','SOT','BBP'];
  //PackTypes=['Mulipack','Baked','Pack'];
  totalActivations=0;
  MatrixConstraintsTable={
    'fsi_fsi':false,
    'fsi_fai':false,
    'fsi_search':false,
    'fsi_sot':false,
    'fsi_bbp':false,

    'fai_fai':false,
    'fai_search':false,
    'fai_sot':false,
    'fai_bbp':false,

    'search_search':false,
    'search_sot':false,
    'search_bbp':false,

    'sot_sot':false,
    'sot_bbp':false,

    'bbp_bbp':false,
  };
  totalProducts=0;
  sumProducts:string='0';
  displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  dataSourceConstraintsMatrix = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS_MATRIX);
  constructor(private routes:Router) {
    let datastream:any=this.routes.getCurrentNavigation()?.extras.state;
    if(datastream){
    if(datastream.source=='from_planning'){
      this.ELEMENT_DATA_CONSTRAINTS=datastream.data[0] || [];
      this.selectedData=datastream.data[1] || [];
      this.PROMOCODE_LIST=datastream.data[2] || [];
      console.log(this.selectedData,"selectedData");
      let jsonObject=groupByJson(this.selectedData,'pack_type');
    this.ELEMENT_DATA_CONSTRAINTS=[];
    for (const [key, value] of Object.entries(jsonObject)) {
      let MuliPlex = new ConstraintObject(key);
      this.ELEMENT_DATA_CONSTRAINTS.push(MuliPlex.getConstraint());
      console.log(this.ELEMENT_DATA_CONSTRAINTS,"entries")
      this.dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  //    localStorage.setItem("defaultActivations", JSON.stringify(this.selectedData));
    }

  }else if(datastream.source=="from_output"){
    this.ELEMENT_DATA_CONSTRAINTS=[];
    this.ELEMENT_DATA_CONSTRAINTS=datastream.data[0] || [];
    console.log(this.ELEMENT_DATA_CONSTRAINTS,"OUTPUT");
    this.selectedData=datastream.data[1] || [];
      this.dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);

  }

   }else{
  //  this.selectedData=JSON.parse(localStorage.getItem('defaultActivations')|| '');
    let jsonObject=groupByJson(this.selectedData,'pack_type');
    for (const [key, value] of Object.entries(jsonObject)) {
      let MuliPlex = new ConstraintObject(key);
      this.ELEMENT_DATA_CONSTRAINTS.push(MuliPlex.getConstraint());
      this.dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
    }

  }
  this.setActivation();
}

  ngOnInit(): void {

  }
  setActivation(){
    this.totalActivations=this.ELEMENT_DATA_CONSTRAINTS.length;
    this.totalProducts=this.selectedData.length;
    let sumLocal=0;
    this.selectedData.map((element:any) => {
      console.log(element,typeof(element));
      sumLocal+=element.selling_price;
    });
    this.sumProducts=sumLocal.toFixed(2);

  }
  simulateScenario(){
    this.routes.navigate(['/scenarioresult'],{ state: {'source':'from_opt_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData]} });
    }
  go_back(){
    this.routes.navigate(['/'],{ state: {'source':'from_activation','data':[this.selectedData,this.PROMOCODE_LIST]} });
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

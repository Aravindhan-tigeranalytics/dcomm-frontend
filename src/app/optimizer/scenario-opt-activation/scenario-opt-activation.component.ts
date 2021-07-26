import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ScenarioPlannerService } from 'src/app/backend-services/scenario-planner.service';
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
  activationLIB:any={};
  DynActivationColumns:any=[];
  datastream:any;
  response_data:any[]=[];
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
  constructor(private routes:Router,private apiServices:ScenarioPlannerService,) {
    this.datastream=this.routes.getCurrentNavigation()?.extras.state;

}

  ngOnInit(): void {

    this.displayedColumnsConstraints= ['pack_type'];
    this.apiServices.getActivationList().subscribe((res:any)=>{
      console.log(res,"RES")
      if(res.code==200){
        this.DynActivationColumns=res.data;
        for(let [key,value] of Object.entries(this.DynActivationColumns)){
          let values:any=value;
          this.activationLIB[values.value]=values.name;
          this.displayedColumnsConstraints.push(values.value)
        }
        console.log(this.displayedColumnsConstraints,"this.displayedColumnsConstraints");
        console.log(this.activationLIB,"this.activationLIB");
      }
    if(this.datastream){
      if(this.datastream.source=='from_planning'){
        console.log("SIMulation Activation");
        this.ELEMENT_DATA_CONSTRAINTS=this.datastream.data[0] || [];
        this.selectedData=this.datastream.data[1] || [];
        this.PROMOCODE_LIST=this.datastream.data[2] || [];
        this.response_data=this.datastream.data[3] || [];
        console.log(this.response_data,"response_data");
        let jsonObject=groupByJson(this.selectedData,'pack_type');

      this.ELEMENT_DATA_CONSTRAINTS=[];
      for (const [key, value] of Object.entries(jsonObject)) {
        console.log("key",key);
        let MuliPlex = new ConstraintObject(key);
        let object:any={'pack_type':key};
        this.DynActivationColumns.forEach((element:any) => {
          object[element.value]=false;
        });
        this.ELEMENT_DATA_CONSTRAINTS.push(object);
        console.log(this.ELEMENT_DATA_CONSTRAINTS,"this.ELEMENT_DATA_CONSTRAINTS");
        this.dataSourceConstraints = new MatTableDataSource(this.ELEMENT_DATA_CONSTRAINTS);
      }

    }else if(this.datastream.source=="from_output"){
      this.ELEMENT_DATA_CONSTRAINTS=[];
      this.ELEMENT_DATA_CONSTRAINTS=this.datastream.data[0] || [];
      this.response_data=this.datastream.data[2] || [];
      console.log(this.ELEMENT_DATA_CONSTRAINTS,"OUTPUT");
      this.selectedData=this.datastream.data[1] || [];
        this.dataSourceConstraints = new MatTableDataSource(this.ELEMENT_DATA_CONSTRAINTS);

    }

     }else{
    //  this.selectedData=JSON.parse(localStorage.getItem('defaultActivations')|| '');
      let jsonObject=groupByJson(this.selectedData,'pack_type');
      for (const [key, value] of Object.entries(jsonObject)) {
        let MuliPlex = new ConstraintObject(key);
        let object:any={'pack_type':key};
        this.DynActivationColumns.forEach((element:any) => {
          object[element.value]=false;
        });
        this.ELEMENT_DATA_CONSTRAINTS.push(object);
        this.dataSourceConstraints = new MatTableDataSource(this.ELEMENT_DATA_CONSTRAINTS);
      }

    }
    this.setActivation();
  });

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
  optimizeScenario(){
    let jsonObject=groupByJson(this.response_data,'pack_type');
    let keys=Object.keys(jsonObject);
    console.log(keys,"keys");
    let validPacktype:any[]=[];
    let to_filterOb:any={};
    this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any) => {
      let push=false;
        for(let [key,value] of Object.entries(element)){
            if((key!='pack_type') && (value==true)){
              push=true;
              let values=to_filterOb[element.pack_type] || [];
              values.push(this.activationLIB[key]);
              to_filterOb[element.pack_type]=values;
            }

        }
        if(push){validPacktype.push(element.pack_type);
        }
    });
    console.log(validPacktype,"validPacktype",to_filterOb);
    let filterData:any=[];
    filterData = this.response_data;
    let accumulateFilter:any=[];
    for(let [key,value] of Object.entries(to_filterOb)){
      filterData = this.response_data.filter((data:any) => key.includes(data["pack_type"]));
      console.log(filterData,"level");
      let PackList:any=value;
      //console.log(PackList.join(' '),"PackList");
        filterData=filterData.filter((data:any) =>  data["activation_type"]==PackList.join(' '));
      console.log(filterData,"level");
      accumulateFilter.push(filterData);
    };

     console.log(accumulateFilter,"accumulateFilter");
     accumulateFilter=accumulateFilter.flat();
     console.log(accumulateFilter,"filterData_")
    this.routes.navigate(['/scenarioresult'],{ state: {'source':'from_opt_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data,accumulateFilter]} });
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

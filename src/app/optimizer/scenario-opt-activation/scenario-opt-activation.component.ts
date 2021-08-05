import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { ScenarioPlannerService } from 'src/app/backend-services/scenario-planner.service';
import { groupByJson } from 'src/app/planner/scenario-planning/scenario-planning.component';
import { environment } from 'src/environments/environment';
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
  MatrixConstraintsTable1:any=[];
  MatrixConstraintsTable:any={
    'fsi_fsi':false,
    'fsi_fai':false,
    'fsi_search':false,
    'fsi_sot':false,
    'fsi_bbp':false,
    'fsi_tax':false,
    'fsi_tbp':false,

    'fai_fai':false,
    'fai_search':false,
    'fai_sot':false,
    'fai_bbp':false,
    'fai_tax':false,
    'fai_tbp':false,

    'search_search':false,
    'search_sot':false,
    'search_bbp':false,
    'search_tax':false,
    'search_tbp':false,

    'sot_sot':false,
    'sot_bbp':false,
    'sot_tax':false,
    'sot_tbp':false,

    'bbp_bbp':false,
    'bbp_tax':false,
    'bbp_tbp':false,

    'tax_tax':false,
    'tax_tbp':false,

    'tpb_tbp':false,

  };
  MatrixConstraintsTableSingles:any={}

  totalProducts=0;
  sumProducts:string='0';
  displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  dataSourceConstraintsMatrix = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS_MATRIX);
  currencySymbol: any;
  totalBudget: number=0;
  MatrixConstraintsTableres: any={};
  constructor(private routes:Router,private apiServices:ScenarioPlannerService,) {
    this.datastream=this.routes.getCurrentNavigation()?.extras.state;
    this.currencySymbol=environment.currencySymbol;
}

  ngOnInit(): void {


   this.MatrixConstraintsTableres={};
    let order:any={};
    let arr:any=[];

    console.log(this.MatrixConstraintsTable1,"this.MatrixConstraintsTable1")
    this.displayedColumnsConstraints= ['pack_type'];
    this.apiServices.getActivationList().subscribe((res:any)=>{
      console.log(res,"RES")
      if(res.code==200){
        this.DynActivationColumns=res.data;
        for(let [key,value] of Object.entries(this.DynActivationColumns)){
          let values:any=value;
          this.activationLIB[values.value]=values.name;
          arr.push(values.value);
          this.displayedColumnsConstraints.push(values.value)
        }
        for(let i=0;i<arr.length;i++){
          for(let j=i;j<arr.length;j++){
            this.MatrixConstraintsTableres[(arr[i]+'_'+arr[j]).trim()]=false;
            if(order[arr[i]]){
              order[arr[i]]+=(arr[i]+'_'+arr[j]).trim()+","
            }else{
              order[arr[i]]=(arr[i]+'_'+arr[j]).trim()+","
            }

          }
        }
        let order1:any={};
        let el:any=[];;
        arr.forEach((element:any,index:any)=>{
          el=[];
          for(let j=0;j<index;j++){
            if(order1[element]){
              order1[element]+=arr[j]+'_'+element+","
            }else{
              order1[element]=arr[j]+'_'+element+","
            }

          }
          let arr1=[];
          if(order1[element]){
            arr1=order1[element].split(',');
          }
          var filtered1 = arr1.filter(function (el:any) {
            return el !="";
          });
          var filtered2 = order[element].split(',').filter(function (el:any) {
            return el !="";
          });
          this.MatrixConstraintsTable1.push(filtered1.concat(filtered2));

        });
      }
    if(this.datastream){
      if(this.datastream.source=='from_planning'){
        console.log("SIMulation Activation");
        this.ELEMENT_DATA_CONSTRAINTS=this.datastream.data[0] || [];
        this.selectedData=this.datastream.data[1] || [];
        this.PROMOCODE_LIST=this.datastream.data[2] || [];
        this.response_data=this.datastream.data[3] || [];

        let jsonObject=groupByJson(this.selectedData,'pack_type');
        console.log(jsonObject,"jsonObject");
      this.ELEMENT_DATA_CONSTRAINTS=[];
      for (const [key, value] of Object.entries(jsonObject)) {
        console.log("key",key);
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
  clearBudget(){
    this.totalBudget=0;
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
    //  console.log(filterData,"level");
      let PackList:any=value;
      //console.log(PackList.join(' '),"PackList");
        filterData=filterData.filter((data:any) =>  data["activation_type"]==PackList.join(' '));
      //console.log(filterData,"filterData");
      if(filterData.length==0){
       // console.log(PackList,"PackList");
        PackList.forEach((element:any) => {
          filterData=this.response_data.filter((data:any) => data["activation_type"].trim()==element.trim());
          accumulateFilter.push(filterData);
        });

      }else{
        accumulateFilter.push(filterData);
      }
      //console.log(filterData,"AfterFilter");

    };

    accumulateFilter=accumulateFilter.flat();
    this.routes.navigate(['/scenarioresult'],{ state: {'source':'from_opt_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data,accumulateFilter]} });
    }
  go_back(){
    let that=this;
    Notiflix.Confirm.show('Exit Optimizer','Are you sure?','Yes','No',
    function(){
      that.routes.navigate(['/planner'],{ state: {'source':'from_activation','data':[that.selectedData,that.PROMOCODE_LIST]} });
    });
    }
    selectAll(){
      this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any)=>{
        for(let [key,value] of Object.entries(element)){
          if(key!='pack_type'){
            element[key]=true;
          }
        }
      });
    }
    selectAllConstraint(){
      console.log("constaint")

        for(let [key,value] of Object.entries(this.MatrixConstraintsTableres)){
          this.MatrixConstraintsTableres[key]=true;
        }
        console.log(this.MatrixConstraintsTableres)
    }
    ResetAll(){
      this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any)=>{
        for(let [key,value] of Object.entries(element)){
          if(key!='pack_type'){
            element[key]=false;
          }
        }
      });
    }
    ResetAllConstraint(){
      for(let [key,value] of Object.entries(this.MatrixConstraintsTableres)){
        this.MatrixConstraintsTableres[key]=false;
       }
    }
}

import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { ScenarioPlannerService } from 'src/app/backend-services/scenario-planner.service';
import { DataControllerService } from 'src/app/base/data-controller/data-controller.service';
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
  ElementCost:any={};
  ELEMENT_DATA_CONSTRAINTS_MATRIX:any=[];
  Fav=[];
  minBudget:number=0
  errorCode:string='';
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
  totalBudget: any=0;
  MatrixConstraintsTableres: any={};
  def_DynActivationColumns: any;
  ratecardSubscribe: any;
  Ratecardjson: any;
  ratejsonObject: any;
  budgetConstraintSubscribe: any;
  constructor(private routes:Router,
    private apiServices:ScenarioPlannerService,
    private dataservice:DataControllerService,) {
    this.datastream=this.routes.getCurrentNavigation()?.extras.state;
    this.currencySymbol=environment.currencySymbol;
}

  ngOnInit(): void {
    this.MatrixConstraintsTableres={};
    let order:any={};
    let arr:any=[];
    console.log(this.MatrixConstraintsTable1,"this.MatrixConstraintsTable1")
    this.displayedColumnsConstraints= ['pack_type'];
    this.ratecardSubscribe = this.dataservice.RatecardOb.subscribe((ratecard:any) => {
      if(ratecard){
        this.Ratecardjson=ratecard;
        this.ratejsonObject=groupByJson(this.Ratecardjson['RateCard'],'pack_sub_type');
      }
    });
    this.budgetConstraintSubscribe = this.dataservice.BudgetConstraintOb.subscribe((constraint:any) => {
      if(constraint){
        this.minBudget=constraint['min'];
        this.totalBudget=constraint['total'];
      }
      console.log(constraint,"constraint");
    });
    this.apiServices.getActivationList().subscribe((res:any)=>{
     // console.log(res,"RES")
      if(res.code==200){
        this.DynActivationColumns=res.data;
        this.def_DynActivationColumns=res.data;
        for(let [key,value] of Object.entries(this.DynActivationColumns)){
          let values:any=value;
          this.activationLIB[values.value]=values.name;
          console.log(this.activationLIB,"this.activationLIB");
          arr.push(values.value);
          this.displayedColumnsConstraints.push(values.value)
        }
        for(let i=0;i<arr.length;i++){
          for(let j=i;j<arr.length;j++){
            this.MatrixConstraintsTableres[(arr[i]+'_'+arr[j]).trim()]=false;
            if(i==j){
              this.MatrixConstraintsTableres[(arr[i]+'_'+arr[j]).trim()]=true;
            }
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
        console.log("Simulation Activation");
        this.ELEMENT_DATA_CONSTRAINTS=this.datastream.data[0] || [];
        this.selectedData=this.datastream.data[1] || [];
        this.PROMOCODE_LIST=this.datastream.data[2] || [];
        this.response_data=this.datastream.data[3] || [];
        let jsonObject=groupByJson(this.selectedData,'pack_sub_type');
        console.log(jsonObject,"jsonObject");
      this.ELEMENT_DATA_CONSTRAINTS=[];
      for (const [key, value] of Object.entries(jsonObject)) {
        console.log("key",key);
        let object:any={'pack_sub_type':key};
        this.DynActivationColumns.forEach((element:any) => {
          object[element.value]=false;
        });
        this.ELEMENT_DATA_CONSTRAINTS.push(object);
        console.log(this.ELEMENT_DATA_CONSTRAINTS,"this.ELEMENT_DATA_CONSTRAINTS");
        this.dataSourceConstraints = new MatTableDataSource(this.ELEMENT_DATA_CONSTRAINTS);
        this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any) => {
          this.ElementCost[element.pack_sub_type]={};
        });
      }
    }else if(this.datastream.source=="from_output"){
      this.ELEMENT_DATA_CONSTRAINTS=[];
      this.ELEMENT_DATA_CONSTRAINTS=this.datastream.data[0] || [];
      this.response_data=this.datastream.data[2] || [];
      console.log(this.ELEMENT_DATA_CONSTRAINTS,"OUTPUT");
      this.selectedData=this.datastream.data[1] || [];
        this.dataSourceConstraints = new MatTableDataSource(this.ELEMENT_DATA_CONSTRAINTS);
        this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any) => {
          this.ElementCost[element.pack_sub_type]={};
        });
    }

     }else{
      this.routes.navigate(['/planner']);
    }
    this.setActivation();
    this.dataservice.ElementCostOb.subscribe((cost:any) => {
      if(cost){
        this.ElementCost=cost;
      }
    });
    console.log(this.ElementCost,"this.ElementCost");
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
  updateBudget(){
    if(this.totalBudget){
      this.totalBudget=parseFloat(this.totalBudget.replace(/,/g, ''));
      console.log(this.totalBudget,"this.totalBudget")
      this.totalBudget=numberWithCommas(this.totalBudget);
    }

  }
  actBudgetCalc(item:any,sub_type:any,event:any,checkbox:any){
    let activationType=this.activationLIB[item];
    let ItemFound=false;
   this.ratejsonObject[sub_type].forEach((element:any) => {
    if(element.activation_type==activationType){
      ItemFound=true;
      if(event.checked){
        this.ElementCost[sub_type][item]=element;
      }else{
        delete this.ElementCost[sub_type][item];
      }

    }

   });
   if(checkbox){
    if(!ItemFound){
      console.warn(activationType,"Not found")
      console.log(checkbox,"checkbox",item);
      this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any)=>{
        console.log(element,sub_type,"false")
        if(element.pack_sub_type==sub_type){
          element[item]=false;
          // console.log(this.displayedColumnsConstraints)
          // console.log("item",element,item);

        }

      });
      Notiflix.Notify.info('Price is not defined for '+activationType+' of '+sub_type);
     }
   }
   this.calcBudget();
   console.log(this.ElementCost,"this.ElementCost");
   this.dataservice.setElementCost(this.ElementCost);
  }
  calcBudget(){
  this.minBudget=0;
   for(let [key,value] of Object.entries(this.ElementCost)){
     console.log(value,"value");
     let min=0;
     let values:any=value;
     let ite=0;
     for(let [key,value] of Object.entries(values)){
      let itemvalues:any=value;
       if(ite==0){
        min=itemvalues.total_cost
       }else{

        if(min>itemvalues.total_cost){
          min=itemvalues.total_cost
        }
       }

      ite++;
    }
     this.minBudget+=min;
   }
   this.dataservice.setBudgetConstraint({'min':this.minBudget,'total':this.totalBudget});
  }
  clearBudget(){
    this.totalBudget=0;

  }
  ngOnDestroy(): void {
    this.ratecardSubscribe.unsubscribe();
    this.budgetConstraintSubscribe.unsubscribe();
  }
  optimizeScenario(){
    let noError=false;
    this.dataservice.setBudgetConstraint({'min':this.minBudget,'total':this.totalBudget});
    let jsonObject=groupByJson(this.response_data,'pack_type');
    let keys=Object.keys(jsonObject);
    let validPacktype:any[]=[];
    let to_filterOb:any={};
    let push=false;
    this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any) => {
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
    let temp_totalBudget:any=0;
    if(this.totalBudget){
      temp_totalBudget=parseFloat(this.totalBudget.replace(/,/g, ''));
    }
    if(this.totalBudget<=0){
      this.errorCode='budget';
      noError=true;
    }
    if(!push){
      this.errorCode='activation';
      noError=true;
    }
    if(this.minBudget>temp_totalBudget){
      this.errorCode='budget_min';
      noError=true;
    }

    if(!noError){
      let filterData:any=[];
      filterData = this.response_data;
      // let accumulateFilter:any=[];
      // for(let [key,value] of Object.entries(to_filterOb)){
      //   filterData = this.response_data.filter((data:any) => key.includes(data["pack_type"]));
      // //  console.log(filterData,"level");
      //   let PackList:any=value;
      //   //console.log(PackList.join(' '),"PackList");
      //     filterData=filterData.filter((data:any) =>  data["activation_type"]==PackList.join(' '));
      //   //console.log(filterData,"filterData");
      //   if(filterData.length==0){
      //    // console.log(PackList,"PackList");
      //     PackList.forEach((element:any) => {
      //       filterData=this.response_data.filter((data:any) => data["activation_type"].trim()==element.trim());
      //       accumulateFilter.push(filterData);
      //     });

      //   }else{
      //     accumulateFilter.push(filterData);
      //   }
      //   //console.log(filterData,"AfterFilter");

      // };
      Notiflix.Loading.dots('Loading...');
      let budgetNumber=parseFloat(this.totalBudget.replace(/,/g, ''));
      let payload={
                    'activations':this.ELEMENT_DATA_CONSTRAINTS,
                    'activation_constraints':this.MatrixConstraintsTableres,
                    'budget':budgetNumber,
                    'products':this.selectedData,
                    'rate_card':this.ratejsonObject,
                    'planner_type':'optimizer',
                    'job_token':'JWT '+localStorage.getItem('token')
                  };
      this.routes.navigate(['/result/optimizer'],{ state: {'source':'from_opt_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data,filterData]}});

      // this.apiServices.get_trans_scenatio_planner_optimizer(payload).subscribe((res:any)=>{
      //   Notiflix.Loading.remove();
      //   if(res.code==200 && res.status=='success'){
      //     this.routes.navigate(['/result/optimizer'],{ state: {'source':'from_opt_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data,filterData];
      //   }
      //   });
      //   }

      // });

    }else{
      if(this.errorCode=='budget'){
        Notiflix.Notify.info('Please provide the budget');
      }else if(this.errorCode=='activation'){
        Notiflix.Notify.info('Please select the activations');
      }else if(this.errorCode=='budget_min'){
        Notiflix.Notify.info('Total Budget should be greater than Min Budget');
      }

    }
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
          if(key!='pack_sub_type'){
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
          if(key!='pack_sub_type'){
            element[key]=false;
          }
        }
      });
    }

    ResetAllConstraint(){
      let arr=[];
      let order:any={};
      this.MatrixConstraintsTableres={};
      for(let [key,value] of Object.entries(this.DynActivationColumns)){
        let values:any=value;
        arr.push(values.value);
      }
      for(let [key,value] of Object.entries(this.MatrixConstraintsTableres)){
        this.MatrixConstraintsTableres[key]=false;
       }
       for(let i=0;i<arr.length;i++){
        for(let j=i;j<arr.length;j++){
          this.MatrixConstraintsTableres[(arr[i]+'_'+arr[j]).trim()]=false;
          if(i==j){
            this.MatrixConstraintsTableres[(arr[i]+'_'+arr[j]).trim()]=true;
          }
          if(order[arr[i]]){
            order[arr[i]]+=(arr[i]+'_'+arr[j]).trim()+","
          }else{
            order[arr[i]]=(arr[i]+'_'+arr[j]).trim()+","
          }

        }
      }
    }
}
function numberWithCommas(num:any) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

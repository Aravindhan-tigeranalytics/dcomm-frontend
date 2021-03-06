import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { ScenarioPlannerService } from 'src/app/backend-services/scenario-planner.service';
import { DataControllerService } from 'src/app/base/data-controller/data-controller.service';
import { groupByJson } from 'src/app/planner/scenario-planning/scenario-planning.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
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
  private _jsonURL = '../../assets/json_data/optimizer.json';
  budgetConstraintSubscribe: any;
  constructor(private routes:Router,
    private http: HttpClient,
    private apiServices:ScenarioPlannerService,
    private dataservice:DataControllerService,) {
    this.datastream=this.routes.getCurrentNavigation()?.extras.state;
    this.currencySymbol=environment.currencySymbol;
}
public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
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
            this.MatrixConstraintsTableres[(arr[i]+'_'+arr[j]).trim()]=true;
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
      this.budgetConstraintSubscribe = this.dataservice.BudgetConstraintOb.subscribe((constraint:any) => {
        if(constraint){
          this.minBudget=constraint['min'];
          this.totalBudget=constraint['total'];
        }
      });

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
    console.log(this.ratejsonObject,"ratejsonObject");
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
   //check for the All category
   if(!ItemFound){
    this.ratejsonObject['All'].forEach((element:any) => {
      if(element.activation_type==activationType){
        ItemFound=true;
        if(event.checked){
          this.ElementCost[sub_type][item]=element;
        }else{
          delete this.ElementCost[sub_type][item];
        }
      }
     });
   }
   if(checkbox){
    if(!ItemFound){
      console.warn(activationType,"Not found")
      console.log(checkbox,"checkbox",item);
      this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any)=>{
        console.log(element,sub_type,"false")
        if(element.pack_sub_type==sub_type){
          element[item]=false;
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
    if(this.datastream){
      if(this.datastream.source=="from_output"){
        this.budgetConstraintSubscribe.unsubscribe();
      }
  }

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
    let MandatorySelect:any={};
    this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any,index:any) => {
      let count=0;
      for(let [key,value] of Object.entries(element)){

        if((key!='pack_sub_type') && (value==true)){
          count++;
          MandatorySelect[index]=count;
        }else{
          MandatorySelect[index]=count;
        }

      };
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
    for(let [key,value] of Object.entries(MandatorySelect)){
      if(value==0){
        this.errorCode='packtype_min_act_sel';
        noError=true;
      }
    };
    if(!noError){
      let filterData:any=[];
      filterData = this.response_data;
      Notiflix.Loading.dots('Loading...');
      let budgetNumber=parseFloat(this.totalBudget.replace(/,/g, ''));
      let parsed_ac:any = {};
      for(let [key,value] of Object.entries(this.MatrixConstraintsTableres)){
        let values:any=value;
        parsed_ac[key]=values.toString();
      }
     // console.log(this.ELEMENT_DATA_CONSTRAINTS,"this.ELEMENT_DATA_CONSTRAINTS")
      let parsed_act:any=[];
      this.ELEMENT_DATA_CONSTRAINTS.forEach((row:any) => {
        let el_rows:any={};
        for(let [key,value] of Object.entries(row)){
          let values:any=value;
          el_rows[key]=values.toString();
        }
        parsed_act.push(el_rows);
      });
      let payload={
                    'activations':parsed_act,
                    'activation_constraints':[parsed_ac],
                    'budget':budgetNumber,
                    'products':this.selectedData,
                    'rate_card':this.Ratecardjson['RateCard'],
                    'planner_type':'optimizer',
                    'job_token':'JWT '+localStorage.getItem('token')
                  };

      // console.log(payload,"payload");
      // this.routes.navigate(['/result/optimizer'],{ state: {'source':'from_opt_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data,filterData]}});

      // this.getJSON().subscribe(data => {
      //   this.response_data=data;
      //   Notiflix.Loading.remove();
      //   console.log(this.response_data,"this.response_data")
      //   let maxRecords=this.groupByPacktype(this.response_data);
      //   this.routes.navigate(['/result/optimizer'],{ state: {'source':'from_opt_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,maxRecords,maxRecords]
      //   }
      //   });
      //  });
      this.apiServices.get_trans_scenatio_planner_optimizer(payload).subscribe((res:any)=>{
        Notiflix.Loading.remove();
        if(res.code==200 && res.status=='success'){
          //let maxRecords=this.groupByPacktype(res.data);
          this.routes.navigate(['/result/optimizer'],{ state: {'source':'from_opt_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,res.data,res.data]
        }
        });
        }

      });

    }else{
      if(this.errorCode=='budget'){
        Notiflix.Notify.info('Please provide the budget');
      }else if(this.errorCode=='activation'){
        Notiflix.Notify.info('Please select the activations');
      }else if(this.errorCode=='budget_min'){
        Notiflix.Notify.info('Total Budget should be greater than Min Budget');
      }else if(this.errorCode=='packtype_min_act_sel'){
        Notiflix.Notify.info('Please select one of the activation in the PACK SUB TYPE ');
      }

    }
     }

     groupByPacktype(data:any){
       let toFilter=data;
       let groupedData=groupByJson(toFilter,'pack_sub_type');
       console.log(groupedData,"groupedData");
       let result=[];
       for(let [key,value] of Object.entries(groupedData)){
        let values:any=value;
        var res = Math.max.apply(Math,values.map(function(o:any){return o.final_lift;}));
        var max_record = values.find(function(o:any){ return o.final_lift == res; });
        values.map(function(o:any){
          max_record.total_incremental_sales+=o.total_incremental_sales;
        });
        result.push(max_record);
       }
       return result;
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
      for(let [key,value] of Object.entries(this.ElementCost)){
        this.displayedColumnsConstraints.forEach((item:any)=>{
          if(item!='pack_type'){
            let ItemFound=false;
            let activationType=this.activationLIB[item];
            this.ratejsonObject[key].forEach((element:any) => {
              if(element.activation_type==activationType){
                  this.ElementCost[key][item]=element;
                  ItemFound=true;
              }
            });
            if(!ItemFound){
              this.ratejsonObject['All'].forEach((element:any) => {
                if(element.activation_type==activationType){
                    this.ElementCost[key][item]=element;
                }
              });
            }
        }
        });

      }

      console.log(this.ElementCost,"this.ElementCost");
      this.calcBudget();
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
      this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any) => {
        this.ElementCost[element.pack_sub_type]={};
      });
      this.calcBudget();
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
          this.MatrixConstraintsTableres[(arr[i]+'_'+arr[j]).trim()]=true;
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

import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { groupByJson } from '../../planner/scenario-planning/scenario-planning.component';
import { ScenarioPlannerService } from '../../backend-services/scenario-planner.service';
import * as Notiflix from 'notiflix';
import { environment } from 'src/environments/environment';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
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
  bbp: boolean;
}
Notiflix.Notify.init({
  position:'right-bottom',
  timeout:3000
})
@Component({
  selector: 'app-scenario-sim-activation',
  templateUrl: './scenario-sim-activation.component.html',
  styleUrls: ['./scenario-sim-activation.component.scss'],
  animations: [
    trigger("changeDivSize", [
      state(
        "initial",
        style({
          backgroundColor: "green",
          width: "100px",
          height: "100px"
        })
      ),
      state(
        "final",
        style({
          backgroundColor: "red",
          width: "200px",
          height: "200px"
        })
      ),
      transition("initial=>final", animate("1500ms")),
      transition("final=>initial", animate("1000ms"))
    ]),

    trigger("balloonEffect", [
      state(
        "initial",
        style({
          backgroundColor: "green",
          transform: "scale(1)"
        })
      ),
      state(
        "final",
        style({
          backgroundColor: "red",
          transform: "scale(1.5)"
        })
      ),
      transition("final=>initial", animate("1000ms")),
      transition("initial=>final", animate("1500ms"))
    ]),

    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0
        })
      ),
      transition("void <=> *", animate(1000))
    ]),

    trigger("EnterLeave", [
      state("flyIn", style({ transform: "translateX(0)" })),
      transition(":enter", [
        style({ transform: "translateX(-100%)" }),
        animate("0.5s 300ms ease-in")
      ]),
      transition(":leave", [
        animate("0.3s ease-out", style({ transform: "translateX(100%)" }))
      ])
    ])
  ]
})

export class ScenarioSimActivationComponent implements OnInit {
  typeSelected:any = [];
  activityType: ScenarioPlanner[] = [];
  types = new FormControl();
  ELEMENT_DATA_CONSTRAINTS:any=[];
  selectedData:any=[];
  response_data:any[]=[];
  PROMOCODE_LIST:any={};
  PackCost:any={};
  PackCostSum:number=0;
  Ratecardjson:any={};
  datastream:any;
  DynActivationColumns:any=[];
  //Placements=['FSI','FAI','Search_Banner','SOT','BBP'];
  //PackTypes=['Mulipack','Baked','Pack'];
  activationLIB:any={};
  totalActivations=0;
  totalProducts=0;
  sumProducts:string='0';
  displayedColumnsConstraints: string[] = [];
  dataSourceConstraints = new MatTableDataSource(this.ELEMENT_DATA_CONSTRAINTS);
  currencySymbol: any;
  actselected: number=0;
  constructor(private routes:Router,private apiServices:ScenarioPlannerService,) {
    this.datastream=this.routes.getCurrentNavigation()?.extras.state;
    this.currencySymbol=environment.currencySymbol;
}

  ngOnInit(): void {
    this.displayedColumnsConstraints= ['pack_type'];
    Notiflix.Loading.dots('Loading...');
    this.apiServices.getActivationList().subscribe((res:any)=>{
      //console.log(res,"RES")
      Notiflix.Loading.remove();
      if(res.code==200){
        this.DynActivationColumns=res.data;
        for(let [key,value] of Object.entries(this.DynActivationColumns)){
          let values:any=value;
          this.activationLIB[values.value]=values.name;
          this.displayedColumnsConstraints.push(values.value)
        }
        //console.log(this.displayedColumnsConstraints,"this.displayedColumnsConstraints");
        //console.log(this.activationLIB,"this.activationLIB");
      }
    if(this.datastream){
      if(this.datastream.source=='from_planning'){
        //console.log("SIMulation Activation");
        this.ELEMENT_DATA_CONSTRAINTS=this.datastream.data[0] || [];
        this.selectedData=this.datastream.data[1] || [];
        this.PROMOCODE_LIST=this.datastream.data[2] || [];
        this.response_data=this.datastream.data[3] || [];
        this.Ratecardjson=this.datastream.data[4] || [];

        console.log(this.response_data,"response_data act planner");
        let jsonObject=groupByJson(this.selectedData,'pack_type');

      this.ELEMENT_DATA_CONSTRAINTS=[];
      for (const [key, value] of Object.entries(jsonObject)) {
        //console.log("key",key);
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
      //console.log(this.ELEMENT_DATA_CONSTRAINTS,"OUTPUT");
      this.selectedData=this.datastream.data[1] || [];
      this.Ratecardjson=this.datastream.data[3] || [];
      let jsonObject=groupByJson(this.Ratecardjson['RateCard'],'activation_type');
      //console.log(jsonObject,"jsonObject");
        this.dataSourceConstraints = new MatTableDataSource(this.ELEMENT_DATA_CONSTRAINTS);
      //console.log(this.selectedData,"this.selectedData");
      this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any)=>{
        for(let [key,value] of Object.entries(element) ){
            if(key!='pack_type'){
              if(value){
                this.actselected+=1;
              }
            }
        }
        });
    }

     }else{
    //  this.selectedData=JSON.parse(localStorage.getItem('defaultActivations')|| '');
      // let jsonObject=groupByJson(this.selectedData,'pack_type');
      // for (const [key, value] of Object.entries(jsonObject)) {
      //   let MuliPlex = new ConstraintObject(key);
      //   let object:any={'pack_type':key};
      //   this.DynActivationColumns.forEach((element:any) => {
      //     object[element.value]=false;
      //   });
      //   this.ELEMENT_DATA_CONSTRAINTS.push(object);
      //   this.dataSourceConstraints = new MatTableDataSource(this.ELEMENT_DATA_CONSTRAINTS);
      // }
this.routes.navigate(['/planner']);
    }
    this.setActivation();
  });

  }
  selectedActivation(item:any,event:any){
    //console.log(item,"item",this.activationLIB[item]);
    let key=this.activationLIB[item];
    let cost=0;
    //console.log(cost,"cost",event.checked);
    if(event.checked){
      this.actselected+=1;
  }else {
    //console.log(this.PackCost,"key")
    this.actselected-=1;
  }
  console.log(this.actselected,"this.actselected");

}
removeKey(key:any){
  if(this.PackCost[key]==0){
    delete this.PackCost[key];
  }
}
  setActivation(){
    this.totalActivations=this.ELEMENT_DATA_CONSTRAINTS.length;
    this.totalProducts=this.selectedData.length;
    let sumLocal=0;
    this.selectedData.map((element:any) => {
      //console.log(element,typeof(element));
      sumLocal+=element.selling_price;
    });
    this.sumProducts=sumLocal.toFixed(2);

  }
  simulateScenario(){
    let jsonObject=groupByJson(this.response_data,'pack_type');
    let keys=Object.keys(jsonObject);
    //console.log(keys,"keys");
    let validPacktype:any[]=[];
    let to_filterOb:any={};
    let NoneSelected=false;
    this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any) => {
      let push=false;
        for(let [key,value] of Object.entries(element)){
            if((key!='pack_type') && (value==true)){
              push=true;
              NoneSelected=true;
              let values=to_filterOb[element.pack_type] || [];
              values.push(this.activationLIB[key]);
              to_filterOb[element.pack_type]=values;
            }
        }
        if(push){validPacktype.push(element.pack_type);
        }
    });
    //console.log(NoneSelected,"NoneSelected");
    let filterData:any=[];
    filterData = this.response_data;
    let accumulateFilter:any=[];

    for(let [key,value] of Object.entries(to_filterOb)){
      //console.log(key,"key")
      filterData = this.response_data.filter((data:any) => key.includes(data["pack_type"]));
      //console.log(filterData,"level",key);
      let PackList:any=value;
      ////console.log(PackList.join(' '),"PackList");
      //console.log(filterData,"filterData");
        filterData=filterData.filter((data:any) =>  data["activation_type"]==PackList.join(' '));
      //console.log(filterData,"level");
      if(filterData.length==0){
        PackList.forEach((element:any) => {
          filterData = this.response_data.filter((data:any) => key.includes(data["pack_type"]));
          filterData=filterData.filter((data:any) => data["activation_type"].trim()==element.trim());
          accumulateFilter.push(filterData);
        });

      }else{
        accumulateFilter.push(filterData);
      }
      //console.log(filterData,"AfterFilter");

    };

     //console.log(accumulateFilter,"accumulateFilter");
     accumulateFilter=accumulateFilter.flat();
    //console.log(accumulateFilter,"filterData_");
    console.log(this.response_data,"this.response_data");
   if(NoneSelected){
    console.log(accumulateFilter,"accumulateFilter");
    Notiflix.Loading.dots('Loading...');
    this.apiServices.get_processed_data({data:accumulateFilter}).subscribe((res:any)=>{
      Notiflix.Loading.remove();
      //console.log(res.data,"resdata");
      if(res.code==200 && res.status=='success'){
        this.routes.navigate(['/scenarioresult'],{ state: {'source':'from_activation','data':[this.ELEMENT_DATA_CONSTRAINTS,
          this.selectedData,this.response_data,res.data,this.Ratecardjson]} });
      }

    })

   }else{
     Notiflix.Notify.info('Please select the activations');
   }
    }
  go_back(){
    let that=this;
    Notiflix.Confirm.show('Exit Simulation','Are you sure?','Yes','No',
    ()=>{
      that.routes.navigate(['/planner'],{ state: {'source':'from_activation','data':[that.selectedData,that.PROMOCODE_LIST,this.Ratecardjson]} });
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
    ResetAll(){
      this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any)=>{
        for(let [key,value] of Object.entries(element)){
          if(key!='pack_type'){
          element[key]=false;
        }
        }
      });
    }
}

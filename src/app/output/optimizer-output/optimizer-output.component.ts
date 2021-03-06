import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { groupByJson } from '../../planner/scenario-planning/scenario-planning.component';
import { Input } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { ScenarioPlannerService } from '../../backend-services/scenario-planner.service';
import * as Notiflix from 'notiflix';
import { environment } from 'src/environments/environment';
import { DataControllerService } from 'src/app/base/data-controller/data-controller.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

export interface ScenarioPlanner {
  product_tpn: number;
  total_incremental_sales: string;
  total_activation_cost:number;
  pack_type: string;
  product_name:string;
  activation_type:string;
  processed_lift: number;
}
export interface ScenarioPlannerConstraint {
  pack_type:string
  fsi: boolean;
  fai: boolean;
  search: boolean;
  sot: boolean;
  bpp: boolean;
}
Notiflix.Notify.init({
  position:'right-bottom',
  timeout:3000
})
@Component({
  selector: 'app-optimizer-output',
  templateUrl: './optimizer-output.component.html',
  styleUrls: ['./optimizer-output.component.scss'],
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
export class OptimizerOutputComponent implements OnInit {

  response_data:any;
  SOURCE: any;
  valueSelected:any=0;
  modalOptions:NgbModalOptions | undefined;
  filterData: any;
  defaultData:any
  datastream:any;
  reload1: boolean=true;
  TATSPack_ARRAY: any=[];
  currencySymbol: any;
  optimizedLift:any=0;
  totalLift:any=0;
  incremantalCSV: number=0;
  totalscvROAS:number=0;
  totalActivationCost:number=0;
  Ratecardjson: any;
  budgetConstraintSubscribe: any;
  totalBudget: any=0;
  constructor(private modalService: NgbModal,
    private dataservice:DataControllerService,
    private routes:Router,private apiServices:ScenarioPlannerService) {
   // console.log(this.route.getCurrentNavigation()?.extras.state);
    this.datastream=this.routes.getCurrentNavigation()?.extras.state;
    this.currencySymbol=environment.currencySymbol;
   this.modalOptions = {
    backdrop:'static',
    backdropClass:'customBackdrop'
  }

};
   ELEMENT_DATA: ScenarioPlanner[] = [];
   activationLIB:any={};
   TATS:any={};
   packTypeList:any;
   TATS_ARRAY:any=[];
   DynActivationColumns:any=[];
   TATS_BY_PACK:any={};
   Chartpoints_pla_rev:any={};
   FileName:string='';
  activationLIBSelected:any={};
  binaryOption=[
  {id: 'Yes', name: "Yes"},
  {id: 'No', name: "No"},];
  reload:boolean=true;
  ELEMENT_DATA_CONSTRAINTS:any=[];
  //displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  //dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  PlacementLabel:any=[];
  @Input() dataSetLabel:any=[ 'FAI', 'FSI', 'SOT', 'BBP','Search'];
  @Input() dataSet:any={ data: [0, 0, 0, 0, 0],
    title: {
      text: 'Incremental Revenue by Placements',
      display: true
    } };
  dataSetLabel1:any=[];
  saveList:any=[{'name':'SELECT','id':0},
  {'name':'Load1','id':1}]
  selectedplacementTypes='';
  dataSet1:any={ data: [], label: 'Expected Lift by Pack type' };
  //'total_activation_cost','total_incremental_sales','processed_lift'
  displayedColumns: string[] = ['pack_sub_type','pack_type','activation_type','total_activation_cost','total_incremental_sales','csv_roas','processed_lift',];
  dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
  selection = new SelectionModel<ScenarioPlanner>(true, []);
  sortedData: ScenarioPlanner[]=[];
  selectedData:any=[];
  skuList: ScenarioPlanner[] = [];
  activityType: ScenarioPlanner[] = [];
  activityLift:any = '';
  activityROI:any = '';
  renderedData: any;
  closeModal: any;
  liftSliderValue:any = [5,60];
  roiSliderValue:any = [5,40];
  groupedOnPackType=[];
  // Configuration for the filters
  skuSelected:any = [];
  placementTypes = new FormControl();
  //segment
  Segment = new FormControl();
  segmentList: any[] = [];
  selectedSegmentList: any = [];
  constraint_list=[]
  ngOnInit(): void {
    Notiflix.Loading.dots('Loading...');
    this.budgetConstraintSubscribe = this.dataservice.BudgetConstraintOb.subscribe((constraint:any) => {
      if(constraint){
        this.totalBudget=constraint['total'];
      }
      console.log(constraint,"constraintz");
      console.log(this.totalBudget,"totalbudget")
    });
    this.apiServices.getActivationList().subscribe((res:any)=>{
      console.log(res,"RES");
      Notiflix.Loading.remove();
      if(res.code==200){
        this.DynActivationColumns=res.data;
        for(let [key,value] of Object.entries(res.data)){
          let values:any=value;
          this.activationLIB[values.value]=values.name;
          this.PlacementLabel.push(values.name);
        }
    if(this.datastream){
      this.SOURCE=this.datastream.source
      if(this.datastream.source=='from_opt_activation'){
      this.ELEMENT_DATA_CONSTRAINTS=this.datastream.data[0] || [];
      this.selectedData=this.datastream.data[1] || [];
      this.response_data=this.datastream.data[2] || [];
      this.filterData=this.datastream.data[3] || [];
      this.defaultData=this.datastream.data[3] || [];
      this.Ratecardjson=this.datastream.data[4] || [];
       this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any) => {
         let itemlist=[];
        for( const [key,value] of Object.entries(element)){
          if((value) && (this.activationLIB[key]!=undefined)){
            itemlist.push(this.activationLIB[key]);
          }
        }
         this.activationLIBSelected[element.pack_type]=itemlist;
       });

     }
     this.ELEMENT_DATA=this.filterData;
     this.ngAfterViewInit();
     this.getSavedData();
     this.groupedOnPackType=groupByJson(this.filterData,'pack_type');
     this.segmentList=Object.keys(this.groupedOnPackType);
     this.selectedSegmentList = this.segmentList;
     this.chartInit(this.ELEMENT_DATA);


    }else{
      this.routes.navigate(['/planner']);
    }
  }
  });
   }
   @ViewChild(MatPaginator) paginator: any;
   ngAfterViewInit() {
     console.log(this.ELEMENT_DATA,"this.ELEMENT_DATA__");
     this.ELEMENT_DATA=this.ELEMENT_DATA.sort((a:any, b:any) => b.processed_lift - a.processed_lift);
     this.ELEMENT_DATA.forEach((element:any) => {
      element['csv_roas']=((element.total_incremental_sales/element.total_activation_cost)*100).toFixed()
    });
    this.dataSource= new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.connect().subscribe(d => {
      this.renderedData = d});
  }
// File Reader ( EXCEL OR CSV) to JSON Format

    // Input Handler for the promocode upload
  async testData(event:any){
    // let promoList:any=await this.onFileChange(event);
    // let FilteredSet=promoList['sheet1'];
    // this.ELEMENT_DATA=FilteredSet;
    // this.dataSource= new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    // this.ngAfterViewInit();
  }
  saveScenarioTrigger(content:any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {

    });
  }
  deleteSavedList(){
    let that=this;
    Notiflix.Confirm.show('Confirm Delete','Are you sure you want to delete this item?','Yes','No',
    ()=>{
      //scenario_planner_listdelete
      this.apiServices.scenario_planner_listdelete(this.valueSelected).subscribe((res:any)=>{
        if(res.code==200 && res.status=='success'){
          that.getSavedData();
          Notiflix.Notify.success('Deleted Successfully ! ');

        }
      });
    });
  }
  LoadSaveList(){
    this.incremantalCSV=0;
    this.totalActivationCost=0;
    this.totalscvROAS=0;
    if(this.valueSelected!=0){
      //load data
      Notiflix.Loading.dots('Loading...');
      this.apiServices.scenario_planner_listdetails(this.valueSelected).subscribe((res:any)=>{
        console.log(res,"listDetails");
        Notiflix.Loading.remove();
        let response=res;
        if(res.code==200 && res.status=='success'){
          this.resetFilter();
          let filterData:any=response['data'][0].json_data;
           this.groupedOnPackType=groupByJson(filterData,'pack_type');
            this.segmentList=Object.keys(this.groupedOnPackType);
            this.selectedSegmentList = this.segmentList;
           filterData = filterData.filter((data:any) => this.selectedSegmentList.includes(data["pack_type"]));

          if(this.selectedplacementTypes.length!=0){
            let to_find:any=[...this.selectedplacementTypes];
            console.log(to_find,"to_find");
            filterData=recursiveFind(filterData,to_find);
            console.log(to_find,"to_find")
          }


          filterData=filterData.sort((a:any, b:any) => b.processed_lift - a.processed_lift);
          console.log(filterData,"filterData");
          this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
         this.dataSource.paginator = this.paginator;
          this.chartInit(filterData);
          Notiflix.Notify.success('Senario is loaded successfully !!!');
          this.filterData=filterData;
          this.modalService.dismissAll();
        }
      });
    }else{
      //load default data
      let filterData:any = this.defaultData.filter((data:any) => this.selectedSegmentList.includes(data["pack_type"]));
      if(this.selectedplacementTypes.length!=0){
        let to_find:any=[...this.selectedplacementTypes];
        filterData=recursiveFind(filterData,to_find);
      }
      this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
      this.dataSource.paginator = this.paginator;
      this.chartInit(filterData);
      this.modalService.dismissAll();
    }
  }
  saveScenario(){
    let planner_type='';
    if(this.SOURCE=='from_opt_activation'){
      planner_type='optimizer';
    }else{
      planner_type='simulation'
    }

    let payload={
      "name":this.FileName,
      "json_data":this.filterData,
      "planner_type":planner_type
  }
  if(this.FileName.trim()!=''){
  this.apiServices.scenario_planner_simulate_save(payload).subscribe((res:any)=>{
    console.log(res,"res")
  if(res.code==200){
    this.modalService.dismissAll();
    Notiflix.Notify.success('Simulation is Saved Successfully');
    this.getSavedData();
    this.FileName='';
  }else{
    if(res.status=='Failed'){
        Notiflix.Notify.failure('Failed to save record');
    }
  }
  });
}else{
  Notiflix.Notify.failure('Please Enter The Scenario Name')
}
  }
  getSavedData(){
      this.apiServices.scenario_planner_list().subscribe((res:any) =>{
          console.log(res,"scenatio_list");
          this.saveList=[];
        if(res.code==200 && res.status=='success'){
          if(this.SOURCE=='from_opt_activation'){
           // planner_type='optimizer';
           this.saveList=[{'name':'Default','id':0}];
           this.saveList.push(...res.data['optimizer']);
          }else{
           // planner_type='simulation'
           //this.saveList=res.data['simulation'];
           this.saveList=[{'name':'Default','id':0}];
           this.saveList.push(...res.data['simulation']);
          }
        }
        console.log(this.saveList,"saveList");
      });
  }
   getpackTypeList(filterData:any,byPacktype:any){
    this.TATS_ARRAY=[];
    for(let [key,value] of Object.entries(this.activationLIB)){
      this.TATS_ARRAY.push({'name':value,'value':this.TATS[key]})
    }
        this.TATSPack_ARRAY=[];
        if(this.packTypeList){
          for(let [key,value] of Object.entries(this.packTypeList)){
            let values:any=value;
            this.TATSPack_ARRAY.push({'name':values.name,'value':this.TATS[key]})
          }
          for(let [key,value] of Object.entries(byPacktype)){
            let lvalue:any=value;
            this.TATS_BY_PACK[key.toLowerCase()]=lvalue.length;
            }
        }
  }
  downloadProducts(){
    let filename="Scenario-Planner - OPTIMIZER"
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: filename,
      useBom: true,
      noDownload: false,
      headers: ['Pack Type', 'Product Sub Type', 'Activity','Cost','Incremental Sales','Expected Lift','CSV ROAS'],
      nullToEmptyString: true,
    };
    this.renderedData.map((item:any)=>
    {
      for(let [key,value] of Object.entries(item)){
        let values:any=value;

        if(!this.displayedColumns.includes(key)){
            delete item[key];
        }else{
          if(key=='processed_lift'){
            item[key]=values.toFixed(2)+"%";
          }
          else if(key=='csv_roas'){
            item[key]=values+"%";
          }
          else if(key=='total_activation_cost'){
            item[key]=values.toFixed(2);
          }
          else if(key=='total_incremental_sales'){
            item[key]=values.toFixed(2);
          }
          //'total_activation_cost','total_incremental_sales'
        }
      }
    });
    new Angular5Csv(this.renderedData, filename, options);
  }
  test_filter(){

  }
decrementRange(value:any){
    value.discount=value.discount-5;
}
incrementRange(value:any){
  value.discount=value.discount+5;
}

goBack(){
  console.log(this.SOURCE,"this.SOURCE")
if(this.SOURCE=='from_opt_activation'){
  this.routes.navigate(['/optimizer'],{ state: {'source':'from_output','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data,this.Ratecardjson]}});

}else{
  this.routes.navigate(['/simulator'],{ state: {'source':'from_output','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data,this.Ratecardjson]}});

}

}
resetFilter(){
  this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.chartInit(this.ELEMENT_DATA);
}
doFilter(){
  this.incremantalCSV=0;
  console.log(this.selectedSegmentList,"Segmentedlist")
    let filterData:any = this.ELEMENT_DATA.filter((data:any) => this.selectedSegmentList.includes(data["pack_type"]));
    if(this.selectedplacementTypes.length!=0){
      let to_find:any=[...this.selectedplacementTypes];
      filterData=recursiveFind(filterData,to_find);
    }
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
    this.dataSource.paginator = this.paginator;
    this.chartInit(filterData);
  }
  chartInit(filterData:any){
    this.TATS={};
   this.incremantalCSV=0;
   this.totalActivationCost=0;
   this.totalscvROAS=0;
   this.optimizedLift=0;
   this.totalLift=0;
    this.DynActivationColumns.forEach((element:any) => {
     this.TATS[element.value]=0;
     //this.Chartpoints_pla_rev[element.value]=0;
     //this.incremantalCSV+=element.total_incremental_sales;
   });
   let gbActivity=groupByJson(filterData,'activation_type');
   console.log(gbActivity,"gbActivity")
   let gbActivityList=Object.keys(gbActivity);
   gbActivityList.forEach((item)=>{
     this.Chartpoints_pla_rev[item]=0;
   });
   let predictedSales=0;
   filterData.forEach((element:any)=>{
     this.incremantalCSV+=element.total_incremental_sales;
     this.totalActivationCost+=element.total_activation_cost;
     this.totalscvROAS+=element.total_incremental_sales/element.total_activation_cost;
     this.optimizedLift+=element.total_activation_cost;
     //this.totalLift+=element.processed_lift;
    // calculation = item["total_incremental_sales"] /(item["predicted_sales"] - item["total_incremental_sales"])
    predictedSales+=element.predicted_sales;
   });
   this.totalLift=this.incremantalCSV/(predictedSales-this.incremantalCSV)*100;
   this.optimizedLift=this.optimizedLift.toFixed()
   this.optimizedLift= numberWithCommas(this.optimizedLift);
   gbActivityList.forEach((item)=>{
     filterData.forEach((element:any)=>{
       if(element.activation_type.includes(item)){
         this.Chartpoints_pla_rev[item]=element.total_incremental_sales
       }

  });
   });
    for(let [key,value] of Object.entries(this.activationLIB)){
     filterData.forEach((element:any)=>{
         if(element.activation_type.includes(value)){
           this.TATS[key]+=1;
           //this.Chartpoints_pla_rev[key]+=element.total_incremental_sales.toFixed(2);

         }

    });
   }
   console.log(this.Chartpoints_pla_rev,"===");

 let byPacktype=groupByJson(filterData,'pack_type');
 console.log(filterData,byPacktype,"1");
 this.chartRender(this.Chartpoints_pla_rev,filterData);
 this.chartExpLift(filterData,byPacktype);
 this.getpackTypeList(filterData,byPacktype);
  }
  chartRender(data:any,filterData:any){
    this.reload=false;
    let data_points:any=[];
    this.dataSetLabel=[];
    console.log(data,"data")
    let gbActivity=groupByJson(filterData,'activation_type');
     console.log(gbActivity,"gbActivity")
     let gbActivityList=Object.keys(gbActivity);
     gbActivityList.forEach((item)=>{
      if(data[item]!=0){
        this.dataSetLabel.push(item);
        data_points.push(data[item].toFixed(2));
      }
      console.log( this.dataSetLabel," this.dataSetLabel",data_points);
    });
    this.dataSet={ data: data_points,
      label: 'Incremental Revenue by Placement' ,backgroundColor:[
      'rgb(156, 39, 176)',
      'rgb(103, 58, 183 )',
      'rgb(33, 150, 243 )',
      'rgb(0, 150, 136 )',
      'rgb(139, 195, 74 )',
      'rgb(233, 30, 99 )',
      'rgb(103, 58, 183 )',
     ]};
    setTimeout(()=>{
      this.reload=true;
    },200);

  }
  chartExpLift(data:any,byPacktype:any){
    this.reload1=false;
    let data_points1:any=[];
    this.dataSetLabel1=[];
    for(let [key,value] of Object.entries(byPacktype)){
      this.dataSetLabel1.push(key);
      let items:any=value;
      let tssum=0;
      items.map((item:any)=>{
        tssum+=parseInt(item.processed_lift);
      });
      console.log(tssum.toFixed(2),"tssum");
      data_points1.push(tssum);
    }
    console.log(data_points1,"data_points1")
    this.dataSet1={ data: data_points1, label: 'Expected Lift By Pack Type' ,backgroundColor:[
      'rgb(156, 39, 176)',
      'rgb(103, 58, 183 )',
      'rgb(33, 150, 243 )',
      'rgb(0, 150, 136 )',
      'rgb(139, 195, 74 )',
      'rgb(233, 30, 99 )',
      'rgb(103, 58, 183 )',
     ]};
    this.apiServices.getpackTypeList().subscribe((res: any) => {
      console.log(res, "getpackTypeList");
      if (res.code == 200 && res.status == 'success') {
        this.packTypeList = res.data;
        this.packTypeList.forEach((element:any) => {
          element['counts']=0;
        });
        this.packTypeList.forEach((element:any) => {
          console.log(byPacktype[element.name],"byPacktype[element.name]");
          element['counts']=byPacktype[element.name]?.length || 0;
        });
        console.log(this.packTypeList,"updated");
      }
    });
    setTimeout(()=>{
      this.reload1=true;
      console.log(this.dataSet1, this.dataSetLabel)
    },200);

  }
  sortData(sort: Sort) {
    console.log("sort");
    const data = this.filterData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'desc';
      switch (sort.active) {
        case 'processed_lift': return compare(a.processed_lift, b.processed_lift, isAsc);
        case 'total_activation_cost': return compare(a.total_activation_total_activation_cost, b.total_activation_total_activation_cost, isAsc);
        case 'total_incremental_sales': return compare(a.total_incremental_sales, b.total_incremental_sales, isAsc);
        default: return 0;
      }
    });
    console.log(this.sortedData,"sortedData")
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.sortedData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.connect().subscribe(d => {
      this.renderedData = d});
   // this.ngAfterViewInit();
  }

  triggerModal(content :any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;}
    this.selection.select(...this.dataSource.data);
    this.setActivationCounter();
  }
  checkbox_row(row:any){
    this.selection.toggle(row);
    this.setActivationCounter();
  }
  checkboxLabel(row?: ScenarioPlanner): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.product_tpn + 1}`;
  }
  updateProductCounter(){
      //totalProducts
  }
  recountCheckbox(event:any){
    event.stopPropagation();
    this.setActivationCounter();
  }
  setActivationCounter(){
    setTimeout(()=>{
      // this.totalActivities=this.selection.selected.length;
      // //console.log(this.selection.selected,"this.totalActivities");
      // console.log(groupByJson(this.selection.selected,'sku'),"SKU group")
      // this.totalProducts=Object.keys(groupByJson(this.selection.selected,'sku')).length;
    },200);
  }
  }
// Used For Datatable sorting
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);

}


function recursiveFind(inputArr:any,find:any):any{
//break-condition
if(find.length==0){
  return inputArr
}else{
  // if(find.length==1){
  //   inputArr=inputArr.filter((data:any) => find[0] == data["activation_type"]);
  //   find.shift();
  // }else{
  //   inputArr=inputArr.filter((data:any) => data["activation_type"].includes(find[0]));
  //   find.shift();
  //   console.log(inputArr,"inputArr");
  // }
     inputArr=inputArr.filter((data:any) => data["activation_type"].includes(find[0]));
     find.shift();
  return recursiveFind(inputArr,find)
}
}
function numberWithCommas(x:any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

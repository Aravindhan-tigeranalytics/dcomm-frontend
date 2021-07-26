import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { ConstraintObject, groupByJson } from '../scenario-planning/scenario-planning.component';
import { Input } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

export interface ScenarioPlanner {
  product_tpn: number;
  date: string;
  pack_type: string;
  product_name:string;
  activation_type:string;
  lift: number;
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
  selector: 'app-scenario-output',
  templateUrl: './scenario-output.component.html',
  styleUrls: ['./scenario-output.component.scss']
})

export class ScenarioOutputComponent implements OnInit {
  response_data:any;
  SOURCE: any;
  filterData: any;
  constructor(private modalService: NgbModal,private routes:Router) {
   // console.log(this.route.getCurrentNavigation()?.extras.state);
   let datastream:any=this.routes.getCurrentNavigation()?.extras.state;
   console.log("initiateds");
   if(datastream){
    this.SOURCE=datastream.source
   if(datastream.source=='from_activation'){

    this.ELEMENT_DATA_CONSTRAINTS=datastream.data[0] || [];
    this.selectedData=datastream.data[1] || [];
    this.response_data=datastream.data[2] || [];
    this.filterData=datastream.data[3] || [];
     this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any) => {
       let itemlist=[];
      for( const [key,value] of Object.entries(element)){
        if((value) && (this.activationLIB[key]!=undefined)){
          itemlist.push(this.activationLIB[key]);
        }
      }
       this.activationLIBSelected[element.pack_type]=itemlist;
     });

   }else if(datastream.source=='from_opt_activation'){

    this.ELEMENT_DATA_CONSTRAINTS=datastream.data[0] || [];
    this.selectedData=datastream.data[1] || [];
    this.response_data=datastream.data[2] || [];
    this.filterData=datastream.data[3] || [];
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
   console.log(this.activationLIBSelected,"activationLIBSelected");


  }else{
    this.routes.navigate(['/']);
  }

};
  ELEMENT_DATA: ScenarioPlanner[] = [];
  activationLIB:any={
    fsi: "FSI",
    fai: "FAI",
    search: "SEARCH",
    sot: "SOT",
    bpp: "BPP",
  };
   TATS={
    fai:0,
    fsi:0,
    sot:0,
    bbp:0,
    search:0
  };
  TATS_BY_PACK:any={
    'multipack':0,
    'block':0,
    'biscuits':0,
    'pouch':0,
    'funsize':0,
    'boked':0
  };
 Chartpoints_pla_rev={
  fai:0,
  fsi:0,
  sot:0,
  bbp:0,
  search:0};

  activationLIBSelected:any={};
  binaryOption=[
  {id: 'Yes', name: "Yes"},
  {id: 'No', name: "No"},];
  reload:boolean=true;
  ELEMENT_DATA_CONSTRAINTS:any=[];
  //displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  PlacementLabel:any=['SELECT', 'FAI', 'FSI', 'SOT', 'BBP','Search'];
  @Input() dataSetLabel:any=[ 'FAI', 'FSI', 'SOT', 'BBP','Search'];
  @Input() dataSet:any={ data: [0, 0, 0, 0, 0], label: 'Incremental Revenue by Placement' };
  dataSetLabel1:any=[];
  selectedplacementTypes='';
  dataSet1:any={ data: [], label: 'Expected Lift by Pack type' };
  displayedColumns: string[] = [ 'product_tpn','pack_type', 'product_name' ,'date','activation_type','lift',];
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
  segmentList: string[] = [];
  selectedSegmentList: any = [];
  constraint_list=[]
  ngOnInit(): void {
    this.ELEMENT_DATA=this.filterData;
    this.groupedOnPackType=groupByJson(this.filterData,'pack_type');
    this.segmentList=Object.keys(this.groupedOnPackType);
    this.selectedSegmentList = this.segmentList;
    console.log(this.selectedSegmentList,"segmentlist");
    this.chartInit(this.filterData);

   }
   @ViewChild(MatPaginator) paginator: any;
   ngAfterViewInit() {
    this.dataSource= new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.connect().subscribe(d => {
      this.renderedData = d});
  }
// File Reader ( EXCEL OR CSV) to JSON Format
async onFileChange(ev:any) {
  let workBook:any = null;
  let jsonData = null;
  const reader = new FileReader();
  const file = ev.target.files[0];
  return new Promise((resolve, reject) => {
  reader.onload = (event) => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary' });
    jsonData = workBook.SheetNames.reduce((initial:any, name:any) => {
      const sheet = workBook.Sheets[name];
      initial[name] = XLSX.utils.sheet_to_json(sheet);
      return initial;
    }, {});
    console.log(jsonData,"jsonData");
    this.groupedOnPackType=groupByJson(jsonData['sheet1'],'pack_type');
    this.segmentList=Object.keys(this.groupedOnPackType);
    this.selectedSegmentList = this.segmentList;
     resolve(jsonData);
     return jsonData
  }
   reader.readAsBinaryString(file);
  });
    }
    // Input Handler for the promocode upload
  async testData(event:any){
    let promoList:any=await this.onFileChange(event);
    let FilteredSet=promoList['sheet1'];
    this.ELEMENT_DATA=FilteredSet;
    this.dataSource= new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    this.ngAfterViewInit();
  }
  downloadProducts(){
    let filename="Scenario-Planner"
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: filename,
      useBom: true,
      noDownload: false,
      headers: ['Product TPN','Pack Type', 'Product Name', 'Date', 'Activity','Expected Lift'],
      nullToEmptyString: true,
    };
    this.renderedData.map((item:any)=>
    {
      for(let [key,value] of Object.entries(item)){
        if(!this.displayedColumns.includes(key)){
            delete item[key];
        }
      }


    });
    new Angular5Csv(this.renderedData, filename, options);
  }
  test_filter(){
    let SearchObject=this.activationLIBSelected;
    let allFilter=[];
    let filterData:any=groupByJson(this.dataSource.data,'tpn_category');
    for(const [key,value] of Object.entries(SearchObject)){
      let temp=[];
      let search_key:any=value;
      if(search_key.length>0){
        for(let i=0;i<search_key.length;i++){
          let to_find:string=search_key[i];
          temp.push(filterData[key].filter((data:any) => new RegExp('\\b' + to_find + '\\b').test( data["activation_type"])));
         }
      }
      allFilter.push(...temp)
    }

    var merged = [].concat.apply([], allFilter);
    this.ELEMENT_DATA=merged;

    this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    this.ngAfterViewInit();
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
  this.routes.navigate(['/optimizer'],{ state: {'source':'from_output','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data]}});

}else{
  this.routes.navigate(['/plan-activation'],{ state: {'source':'from_output','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData,this.response_data]}});

}

}
doFilter(){
  console.log(this.selectedSegmentList,"Segmentedlist")
    let filterData:any = this.ELEMENT_DATA.filter((data:any) => this.selectedSegmentList.includes(data["pack_type"]));
    if(this.selectedplacementTypes.length!=0){
      let to_find:any=this.selectedplacementTypes;
      console.log(to_find,"to_find");
      filterData=recursiveFind(filterData,to_find);
    }
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
    this.dataSource.paginator = this.paginator;
   // this.ngAfterViewInit();
    let chartData={};
    //dataSetLabel:any=['SELECT', 'FAI', 'FSI', 'SOT', 'BBP','Search'];
  //  this.chartInit(filterData);
  }
  chartInit(filterData:any){
    this.TATS={fai:0,fsi:0,sot:0,bbp:0, search:0};
    this.Chartpoints_pla_rev={fai:0,fsi:0,sot:0,bbp:0,search:0};
      filterData.forEach((element:any)=>{
          if(element.activation_type.includes('FAI')){
            this.TATS.fai+=1;
            this.Chartpoints_pla_rev.fai+=element.cost;
          } if(element.activation_type.includes('FSI')){
            this.TATS.fsi+=1;
            this.Chartpoints_pla_rev.fsi+=element.cost;
          }  if(element.activation_type.includes('SOT')){
            this.TATS.sot+=1;
            this.Chartpoints_pla_rev.sot+=element.cost;
          }  if(element.activation_type.includes('BBP')){
            this.TATS.bbp+=1;
            this.Chartpoints_pla_rev.bbp+=element.cost;
          }  if(element.activation_type.includes('Search')){
            this.TATS.search+=1;
            this.Chartpoints_pla_rev.search+=element.cost;
          }
    });

    console.log(this.Chartpoints_pla_rev,"this.Chartpoints_pla_rev");
    let byPacktype=groupByJson(filterData,'pack_type');
    this.chartRender(this.Chartpoints_pla_rev);
    this.chartExpLift(filterData,byPacktype);
   // console.log(byPacktype,"byPacktype")
    //TATS_BY_PACK
    for(let [key,value] of Object.entries(byPacktype)){
        let lvalue:any=value;
        this.TATS_BY_PACK[key.toLowerCase()]=lvalue.length;

    }
console.log(this.TATS_BY_PACK,"TATS_BY_PACK")
  }
  chartRender(data:any){
    this.reload=false;
    let data_points:any=[];
    this.dataSetLabel=[];
    for(let [key,value] of Object.entries(this.activationLIB)){
      this.dataSetLabel.push(value);
      data_points.push(data[key]);
    }
    this.dataSet={ data: data_points, label: 'Incremental Revenue by Placement' };
    setTimeout(()=>{
      this.reload=true;
    },200);

  }
  chartExpLift(data:any,byPacktype:any){
    this.reload=false;
    let data_points1:any=[];
    this.dataSetLabel1=[];
    for(let [key,value] of Object.entries(byPacktype)){
      this.dataSetLabel1.push(key);
      let items:any=value;
      let tssum=0;
      items.map((item:any)=>{
        tssum+=parseInt(item.lift);
      });
      console.log(tssum.toFixed(2),"tssum");
      data_points1.push(tssum);
    }
    console.log(this.dataSetLabel1,"dataSetLabel1");
    console.log(data_points1,"data_points1");
    this.dataSet1={ data: data_points1, label: 'Expected Lift By Pack Type' };
    setTimeout(()=>{
      this.reload=true;
    },200);

  }
  sortData(sort: Sort) {
    const data = this.ELEMENT_DATA.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'lift': return compare(a.lift, b.lift, isAsc);
        default: return 0;
      }
    });
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.sortedData);
    this.ngAfterViewInit();
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

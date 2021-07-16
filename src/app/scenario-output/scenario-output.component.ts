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

export interface ScenarioPlanner {
  tpn: number;
  tpn_category:string;
  activations:string;
  lift: number;
  total_cost: number;
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

  constructor(private modalService: NgbModal,private routes:Router) {
   // console.log(this.route.getCurrentNavigation()?.extras.state);
   let datastream:any=this.routes.getCurrentNavigation()?.extras.state;
   if(datastream){
   if(datastream.source=='from_activation'){

    this.ELEMENT_DATA_CONSTRAINTS=datastream.data[0] || [];
    this.selectedData=datastream.data[1] || [];
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
}
 Chartpoints_pla_rev={fai:0,
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
  displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  PlacementLabel:any=['SELECT', 'FAI', 'FSI', 'SOT', 'BBP','Search'];
  @Input() dataSetLabel:any=[ 'FAI', 'FSI', 'SOT', 'BBP','Search'];
  @Input() dataSet:any={ data: [0, 0, 0, 0, 0], label: 'Incremental Revenue by Placement' };
  dataSetLabel1:any=['Baked', 'Multipack',  'Block'];
  selectedplacementTypes='';
  dataSet1:any={ data: [45, 37, 33], label: 'Expected Lift by Pack type  ' };
  displayedColumns: string[] = [ 'tpn', 'tpn_category' ,'activations','lift','total_cost'];
  dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
  selection = new SelectionModel<ScenarioPlanner>(true, []);
  sortedData: ScenarioPlanner[]=[];
  selectedData:any=[];

  skuList: ScenarioPlanner[] = [];
  activityType: ScenarioPlanner[] = [];
  activityLift:any = '';
  activityROI:any = '';
  closeModal: any;
  liftSliderValue:any = [5,60];
  roiSliderValue:any = [5,40];
  groupedOnPackType=[];
    // Configuration for the filters
  skuSelected:any = [1235,1243,1246];
  placementTypes = new FormControl();
  //segment
  Segment = new FormControl();
  segmentList: string[] = [];
  selectedSegmentList: any = [];
  constraint_list=[]
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
   }
   @ViewChild(MatPaginator) paginator: any;
   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
    this.groupedOnPackType=groupByJson(jsonData['sheet1'],'tpn_category');
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
          temp.push(filterData[key].filter((data:any) => new RegExp('\\b' + to_find + '\\b').test( data["activations"])));
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
this.routes.navigate(['/plan-activation'],{ state: {'source':'from_output','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selectedData]}});
}
doFilter(){
    let filterData:any = this.ELEMENT_DATA.filter((data:any) => this.selectedSegmentList.includes(data["tpn_category"]));
    if(this.selectedplacementTypes!='SELECT'){
      let to_find=this.selectedplacementTypes;
      filterData=filterData.filter((data:any) =>  new RegExp('\\b' + to_find + '\\b').test( data["activations"]));
    }
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
    this.ngAfterViewInit();
    let chartData={};
    //dataSetLabel:any=['SELECT', 'FAI', 'FSI', 'SOT', 'BBP','Search'];
    this.TATS={fai:0,fsi:0,sot:0,bbp:0, search:0};
    this.Chartpoints_pla_rev={fai:0,fsi:0,sot:0,bbp:0,search:0};
      filterData.forEach((element:any)=>{
          if(element.activations.includes('FAI')){
            this.TATS.fai+=1;
            this.Chartpoints_pla_rev.fai+=element.total_cost;
          }else if(element.activations.includes('FSI')){
            this.TATS.fsi+=1;
            this.Chartpoints_pla_rev.fsi+=element.total_cost;
          }else  if(element.activations.includes('SOT')){
            this.TATS.sot+=1;
            this.Chartpoints_pla_rev.sot+=element.total_cost;
          }else  if(element.activations.includes('BBP')){
            this.TATS.bbp+=1;
            this.Chartpoints_pla_rev.bbp+=element.total_cost;
          }else  if(element.activations.includes('Search')){
            this.TATS.search+=1;
            this.Chartpoints_pla_rev.search+=element.total_cost;
          }
    });
    this.chartRender(this.Chartpoints_pla_rev);
  }
  chartRender(data:any){
    this.reload=false;
    console.log(data,"Data");
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
  sortData(sort: Sort) {
    const data = this.ELEMENT_DATA.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    // tpn: number;
    // tpn_category:string;
    // activations:string;
    // lift: number;
    // total_cost: number;
    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'tpn': return compare(a.tpn, b.tpn, isAsc);
        case 'tpn_category': return compare(a.tpn_category, b.tpn_category, isAsc);
        case 'activations': return compare(a.activations, b.activations, isAsc);
        case 'lift': return compare(a.lift, b.lift, isAsc);
        case 'total_cost': return compare(a.total_cost, b.total_cost, isAsc);
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.tpn + 1}`;
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



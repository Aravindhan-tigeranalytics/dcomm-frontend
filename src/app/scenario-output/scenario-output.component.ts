import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { ConstraintObject, groupByJson } from '../scenario-planning/scenario-planning.component';

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

  constructor(private modalService: NgbModal,private route:Router) {
   // console.log(this.route.getCurrentNavigation()?.extras.state);
   let input=this.route.getCurrentNavigation()?.extras.state;
   if(input){
   if(typeof(input)!=undefined){
    this.ELEMENT_DATA_CONSTRAINTS=this.route.getCurrentNavigation()?.extras.state;
     this.dataSourceConstraints=new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
    }
   }
   }
  ELEMENT_DATA: ScenarioPlanner[] = [
  ];
  binaryOption=[
  {id: 'Yes', name: "Yes"},
  {id: 'No', name: "No"},];
  ELEMENT_DATA_CONSTRAINTS:any=[];
  displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  dataSetLabel:any=['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  dataSet:any={ data: [45, 37, 60, 70, 46, 33], label: 'Incremental Revenue by Placement' };
  dataSetLabel1:any=['Apple', 'Banana',  'Grapes'];
  dataSet1:any={ data: [45, 37, 33], label: 'Expected Lift by Pack type  ' };
  displayedColumns: string[] = [ 'tpn', 'tpn_category' ,'activations','lift','total_cost'];
  dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
  selection = new SelectionModel<ScenarioPlanner>(true, []);
  sortedData: ScenarioPlanner[]=[];
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
  typeSelected:any = ['FSI','FAI','TPR','Search'];
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom',];
  constraint_list=['Baked','Multipack']
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    for(let i=0;i<this.constraint_list.length;i++){
      let MuliPlex = new ConstraintObject(this.constraint_list[i]);
      this.ELEMENT_DATA_CONSTRAINTS.push(MuliPlex.getConstraint());
      this.dataSourceConstraints=new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
    }
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
   // console.log(this.groupedOnPackType,"Grouped Type");
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
    console.log(FilteredSet,"FilteredSet");
    this.dataSource= new MatTableDataSource<ScenarioPlanner>(FilteredSet);
    this.ngAfterViewInit();
  }
  test_filter(){
    let to_search="TBP BBP FSI FAI SOT".split(' ');
    let filterData:any=this.dataSource.data;
    for(let i=0;i<to_search.length;i++){
      let to_find:string=to_search[i];
      filterData=filterData.filter((data:any) => new RegExp('\\b' + to_find + '\\b').test( data["activations"]));
    }
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
    this.ngAfterViewInit();
  }
decrementRange(value:any){
    value.discount=value.discount-5;
}
incrementRange(value:any){
  value.discount=value.discount+5;
}
goBack(){
this.route.navigate(['/plan-activation']);
}
doFilter(){
    this.activityLift = this.liftSliderValue[0] + ' to ' + this.liftSliderValue[1];
    this.activityROI = this.roiSliderValue[0] + ' to ' + this.roiSliderValue[1];
    let filterData:any = this.ELEMENT_DATA.filter((data:any) => this.skuSelected.includes(data["TPN"]));
    filterData = filterData.filter((data:any) => this.typeSelected.includes(data["TPN"]));
    filterData = filterData.filter((o:any)=> {
      return o['expect_lift'] <= this.liftSliderValue[1] && o['expect_lift'] >= this.liftSliderValue[0];
    });
    filterData = filterData.filter((o:any)=> {
      return o['expected_roi'] <= this.roiSliderValue[1] && o['expected_roi'] >= this.roiSliderValue[0];
    });
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
    //this.ngAfterViewInit();
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
        case 'position': return compare(a.position, b.position, isAsc);
        case 'sku': return compare(a.sku, b.sku, isAsc);
        case 'activation_type': return compare(a.activation_type, b.activation_type, isAsc);
        case 'expect_lift': return compare(a.expect_lift, b.expect_lift, isAsc);
        case 'expected_roi': return compare(a.expected_roi, b.expected_roi, isAsc);
        default: return 0;
      }
    });
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.sortedData);
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



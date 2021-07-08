import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

export interface ScenarioPlanner {
  activation_type: string;
  sku: number;
  product_name:string,
  expect_lift: number;
  rec_activity: number;
}


@Component({
  selector: 'app-scenario-output',
  templateUrl: './scenario-output.component.html',
  styleUrls: ['./scenario-output.component.scss']
})



export class ScenarioOutputComponent implements OnInit {

  constructor(private modalService: NgbModal,private route:Router) { }
  ELEMENT_DATA: ScenarioPlanner[] = [
    {sku : 2423232,product_name:'Mars 4pk', activation_type: 'FSI', expect_lift: 13, rec_activity: 12},
    {sku : 1233235,product_name:'Snickers 4pk', activation_type: 'FAI', expect_lift: 32, rec_activity:  22},
    {sku : 1223535,product_name:'Galaxy 4pk', activation_type: 'TPR', expect_lift: 20, rec_activity:  12},
    {sku : 5451235,product_name:'Twix 9pk', activation_type: 'Search', expect_lift: 9, rec_activity: 32},
    {sku : 7851243,product_name:'Twix White 9pk', activation_type: 'FSI', expect_lift: 10 ,rec_activity: 12},

  ];
  binaryOption=[
  {id: 'Yes', name: "Yes"},
  {id: 'No', name: "No"},
]
displayedColumns: string[] = [ 'activation_type', 'sku' ,'product_name','rec_activity','expect_lift'];

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
    // Configuration for the filters
  skuSelected:any = [1235,1243,1246];
  placementTypes = new FormControl();
  typeSelected:any = ['FSI','FAI','TPR','Search'];
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom',];
  ngOnInit(): void {


   }

testData(){
  console.log(this.ELEMENT_DATA,"ELEMENT_DATA");
}
decrementRange(value:any){
  console.log("decrementRange");
    value.discount=value.discount-5;
}
incrementRange(value:any){
  console.log("incrementRange");
  value.discount=value.discount+5;
}
goBack(){
this.route.navigate(['/']);
}
doFilter(){
    this.activityLift = this.liftSliderValue[0] + ' to ' + this.liftSliderValue[1];
    this.activityROI = this.roiSliderValue[0] + ' to ' + this.roiSliderValue[1];
    let filterData:any = this.ELEMENT_DATA.filter((data:any) => this.skuSelected.includes(data["sku"]));
    filterData = filterData.filter((data:any) => this.typeSelected.includes(data["activation_type"]));
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.sku + 1}`;
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



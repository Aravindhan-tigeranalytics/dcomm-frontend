import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

export interface ScenarioPlanner {
  pack_type: string;
  product_tpn: string;
  product_name: string;
  list_price: number;
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
  selector: 'app-scenario-planning',
  templateUrl: './scenario-planning.component.html',
  styleUrls: ['./scenario-planning.component.scss']
})

export class ScenarioPlanningComponent implements OnInit {

  constructor(private modalService: NgbModal,private routes:Router) { }
  ELEMENT_DATA: ScenarioPlanner[] = [
    {pack_type: 'MultiPack',product_tpn : '78775737', product_name: 'Mars 4pk', list_price: 15.2,
     promotion: 'Yes',discount:10, edlp: 'Yes',edlp_conversion: 6},
     {pack_type: 'MultiPack',product_tpn : '45462146', product_name: 'Mars 100 kcal MP', list_price: 7.05 ,  promotion: 'Yes',discount:5, edlp: 'Yes',edlp_conversion: 6},
     {pack_type: 'MultiPack',product_tpn : '13546358', product_name: 'Maltesers funsize 9pk', list_price: 1.2,
     promotion: 'No',discount:15, edlp: 'Yes',edlp_conversion: 6},
     {pack_type: 'Baked',product_tpn : '48561354', product_name: 'Twix 9pk', list_price: 1.65,
     promotion: 'Yes',discount:5, edlp: 'No',edlp_conversion: 6},
     {pack_type: 'Baked',product_tpn : '125613558', product_name: 'Twix White 9pk', list_price: 8,
     promotion: 'No',discount:0, edlp: 'Yes',edlp_conversion: 6},

  ];
  ELEMENT_DATA_CONSTRAINTS=[{
    pack_type:'AYR Boxed',fsi:true,fai:true,search:true,sot:false,bpp:false,},
    {pack_type:'Baked',fsi:false,fai:true,search:false,sot:true,bpp:true,},
    {pack_type:'Choc Block',fsi:true,fai:false,search:true,sot:false,bpp:false,},
    {pack_type:'Multipack',fsi:false,fai:true,search:false,sot:true,bpp:true,},
    {pack_type:'Funsize', fsi:true,fai:true,search:true,sot:true,bpp:false,},]
  //'fsi', 'fai','search', 'sot', 'bpp'
  binaryOption=[
  {id: 'Yes', name: "Yes"},
  {id: 'No', name: "No"},
]
  displayedColumns: string[] = ['select', 'pack_type','product_tpn', 'product_name', 'list_price',
  'promotion','discount','edlp','edlp_conversion'];
  dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
  displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
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
  typeSelected:any = ['FSI','FAI','TPR','Search'];
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  ngOnInit(): void {


   }

simulateScenario(){
this.routes.navigate(['/scenarioresult']);
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

import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as Notiflix from 'notiflix';
import { HtmlTagDefinition } from '@angular/compiler';
export interface ScenarioPlanner {
  pack_type: string;
  product_tpn: string;
  product_name: string;
  list_price: number;
  promotion_type: string;
  promotion_type_list: any[];
  promotion_list: any[];
  promotion: string;
  discount: number;
  edlp: string;
  selling_price: number;
}
export interface ScenarioPlannerConstraint {
  pack_type:string
  fsi: boolean;
  fai: boolean;
  search: boolean;
  sot: boolean;
  bpp: boolean;
}

 export class ConstraintObject implements ScenarioPlannerConstraint {
  pack_type:string
  fsi: boolean;
  fai: boolean;
  search: boolean;
  sot: boolean;
  bpp: boolean;

  constructor(pack_type: string) {
    this.pack_type=pack_type;
    this.fsi=false;
    this.fai=false;
    this.search=false;
    this.sot=false;
    this.bpp=false;
         }
    getConstraint(){
      return {"pack_type":this.pack_type,
              "fsi":this.fsi,
              "fai":this.fai,
              "search":this.search,
              "sot":this.sot,
              "bpp":this.bpp}
    }
}
Notiflix.Notify.init({
  width:'300px',
  timeout: 5000,
  position:'right-top',
  cssAnimationStyle: 'from-bottom',
  distance:'20px',
  opacity: 1,
});
@Component({
  selector: 'app-scenario-planning',
  templateUrl: './scenario-planning.component.html',
  styleUrls: ['./scenario-planning.component.scss']
})

export class ScenarioPlanningComponent implements OnInit {

  constructor(private modalService: NgbModal,private routes:Router) {
    let input=this.routes.getCurrentNavigation()?.extras.state;
    if(input){
    if(typeof(input)!=undefined){
     let datastream:any=this.routes.getCurrentNavigation()?.extras.state ;
     if(datastream.source=='from_activation'){
     // this.selection = new SelectionModel<ScenarioPlanner>(true, [...datastream.data]);
     let selectedItems=datastream.data[0] || [];
     let Promolist=datastream.data[1] || [];
      let grouped=groupByJson(selectedItems,'product_tpn');
      let grouped_keys=Object.keys(grouped);
      this.dataSource.data.forEach(row => {
        if (grouped_keys.includes(row.product_tpn))
        {
          row.list_price=grouped[row.product_tpn][0].list_price;
          row.promotion_type=grouped[row.product_tpn][0].promotion_type;
          row.promotion_list=grouped[row.product_tpn][0].promotion_list;
          row.promotion=grouped[row.product_tpn][0].promotion;
          row.discount=grouped[row.product_tpn][0].discount;
          row.edlp=grouped[row.product_tpn][0].edlp;
          row.selling_price= grouped[row.product_tpn][0].selling_price;
          row.promotion_type_list= grouped[row.product_tpn][0].promotion_type_list;
          this.selection.select(row);
        }else{
           row.promotion_type_list= grouped[grouped_keys[0]][0].promotion_type_list;
           this.PROMOCODE_LIST=grouped[grouped_keys[0]][0].promotion_type_list;
        }
        this.PROMOCODE_LIST=Promolist;
      });

     }
    }
  }
  }
  ELEMENT_DATA: ScenarioPlanner[] = [
    {pack_type: 'Multipack',product_tpn : '78775737', product_name: 'Mars 4pk', list_price: 15.2,
    promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
    {pack_type: 'Choco',product_tpn : '125613558', product_name: 'Twix White 9pk', list_price: 8,
     promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
     {pack_type: 'Choco',product_tpn : '45462146', product_name: 'Mars 100 kcal MP', list_price: 7.05 ,
       promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
     {pack_type: 'Baked',product_tpn : '48561354', product_name: 'Twix 9pk', list_price: 1.65,
     promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
     {pack_type: 'Baked',product_tpn : '1253613558', product_name: 'Twix White 9pk', list_price: 8,
     promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
     {pack_type: 'Baked',product_tpn : '1256413558', product_name: 'Twix White 9pk', list_price: 8,
     promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
     {pack_type: 'Multipack',product_tpn : '135462358', product_name: 'Maltesers funsize 9pk',list_price: 1.2,
     promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
     {pack_type: 'Multipack',product_tpn : '454632146', product_name: 'Mars 100 kcal MP',list_price: 7.05 ,
       promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
     {pack_type: 'Multipack',product_tpn : '13546358', product_name: 'Maltesers funsize 9pk',list_price: 1.2,
     promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
      {pack_type: 'Multipack',product_tpn : '454621246', product_name: 'Mars 100 kcal MP', list_price: 7.05 ,
       promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
     {pack_type: 'Multipack',product_tpn : '135463258', product_name: 'Maltesers funsize 9pk',list_price: 1.2,
     promotion_type: 'SELECT',promotion: 'No',discount:0, edlp: 'Yes',selling_price: 0,promotion_list:[],promotion_type_list:[]},
  ];
  ELEMENT_DATA_CONSTRAINTS:any=[];
  //'fsi', 'fai','search', 'sot', 'bpp'

  PROMOCODE_LIST:any={};

  binaryOption=[
  {id: 'Yes', name: "Yes"},
  {id: 'No', name: "No"},
]
  promoCodeList:any=[ {id: 'SELECT', name: "--SELECT--"},];
  promoCodeDesc:any=[ {id: 'SELECT', name: "--SELECT--"},];
  displayedColumns: string[] = ['select', 'pack_type','product_tpn', 'product_name', 'list_price',
  'promotion_type','promotion','discount','edlp','selling_price'];
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
  search_tag:string='';
  liftSliderValue:any = [5,60];
  roiSliderValue:any = [5,40];
    // Configuration for the filters
  skuSelected:any = [1235,1243,1246];
  types = new FormControl();
  typeSelected:any = [];
  name = 'This is XLSX TO JSON CONVERTER';
  willDownload = false;
  ngOnInit(): void {
    this.activityType = [...new Map(this.ELEMENT_DATA.map(item => [item["pack_type"], item])).values()];
    this.typeSelected =this.activityType.map(item => item["pack_type"]);
    console.log(this.typeSelected);
    this.setDefaultSellingPrice();
}

simulateScenario(){
  if(this.selection.selected.length>=1){
    this.routes.navigate(['/plan-activation'],{ state: {'source':'from_planning','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selection.selected,this.PROMOCODE_LIST]}});
  }else{
    Notiflix.Notify.warning('Please select the records');
  }

}
testData(){
  //console.log(this.ELEMENT_DATA,"ELEMENT_DATA");
}
decrementRange(value:any){
  if(value.discount<=5){
    value.discount=0;
  }else{
    value.discount=value.discount-5;

  }
  this.setSellingPrice(value);
}
incrementRange(value:any){
  if(value.discount>=95){
    value.discount=100;
  }else{
    value.discount=value.discount+5;

  }
  this.setSellingPrice(value);
}
doFilter(){
    let filterData= this.ELEMENT_DATA.filter((data:any) => this.typeSelected.includes(data["pack_type"]));
    if(this.search_tag.trim()!=''){
      let gblFilter=this.search_tag.toLowerCase();
      filterData = filterData.filter((data:any) => gblFilter.match(data["product_name"].toLowerCase())
      );
    }
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
  }
  clear_search(){
    this.search_tag='';
    this.doFilter();
  }
  resetFilter(){
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    this.typeSelected =this.activityType.map(item => item["pack_type"]);
  }

  // Datatable Sort  Unused
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
// Datatable Sort

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
// Checkbox actions
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
  // Checkbox actions
  updateProductCounter(){
      //totalProducts
  }
  // Input Handler for the promocode upload
  async PromoReader(event:any){
    let promoList:any=await this.onFileChange(event);
    try{
      let groupedPCode=groupByJson(promoList['Sheet1'],'Promotion Code');
      this.PROMOCODE_LIST=groupedPCode;
      console.log(this.PROMOCODE_LIST,"Promolist");
      Object.keys(groupedPCode).forEach(element => {
        this.promoCodeList.push({'id':element,'name':element});
      });
      this.ELEMENT_DATA.forEach((element)=>{
        element.promotion_type_list=this.promoCodeList;
      });
    }catch(exception){
      Notiflix.Notify.warning('Invalid File Format');
    }

  }
  // Updation the promo desc dropdown for the based on the selected promocode
    setPromoDesc(selected:any,element:any){
      if(selected!='SELECT'){
        this.promoCodeDesc=this.PROMOCODE_LIST[selected];
        element.promotion_list=this.PROMOCODE_LIST[selected];
        element.edlp='No';
      }else{
        element.promotion_list=[];
        element.promotion='';
        element.edlp='Yes';
      }
    //  this.setSellingPrice(element);
  }
  // Update change on the cases 1 and 2 and 3
  //Case 1: promotion NO and EDLP NO =Selling=Listprice
  //Case 2: promotion YES and EDLP NO = Calculate the discount and subtract the listprice and show
  //Case 3: promotion NO and EDLP YES =Selling=Listprice
  // SELECT == NO
  EDLPChange(selected:any,element:any){
   if(selected.value=='No'){
    //element.promotion='Yes';

   }else{
    element.promotion_type='SELECT';
    let dummyselect='SELECT'
    this.promoCodeDesc=this.PROMOCODE_LIST[dummyselect];
    element.promotion_list=this.PROMOCODE_LIST[dummyselect];
   }
   this.setSellingPrice(element);
  }
  setDefaultSellingPrice(){
    this.ELEMENT_DATA.forEach((element)=>{
      element.selling_price=element.list_price;
    });
  }
  setSellingPrice(element:any){
    if(element.promotion_type=='SELECT' && element.edlp=='No'){
        element.selling_price=element.list_price;
    }
    if(element.promotion_type=='SELECT' && element.edlp=='Yes'){
      element.selling_price=element.list_price;
  }
  if(element.promotion_type!='SELECT' && element.edlp=='No'){
      let calculated_price=element.list_price-((element.discount/100)*(element.list_price))
      element.selling_price=parseFloat(calculated_price.toFixed(2));
  }
  }
  // Update the Promotion Code Discount based on the Desc Selected
  updateDiscount(event:any,row:any){
    let discounted=((event.value/row.list_price)*100).toFixed(2);
    if(discounted){
      row.discount=discounted;
    }
    this.setSellingPrice(row);
  }
  updateDiscount_price(event:any,row:any){
    if(row.promotion!='No'){
      let discounted=((row.promotion/event.target.value)*100).toFixed(2);
      row.discount=discounted;
    }
    this.setSellingPrice(row);
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
       const dataString = JSON.stringify(jsonData);
       console.log(dataString,"dataString");
       resolve(jsonData);
       return jsonData
    }
     reader.readAsBinaryString(file);
    });
      }
  changeConstraint(row:any){
    let jsonObject=groupByJson(this.ELEMENT_DATA_CONSTRAINTS,'pack_type');
    let availList:any=Object.keys(jsonObject);
    if(!availList.includes(row.pack_type)){
      let MuliPlex = new ConstraintObject(row.pack_type);
      this.ELEMENT_DATA_CONSTRAINTS.push(MuliPlex.getConstraint());
      this.dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
     }
     else{
      if(jsonObject[row.pack_type].length==3){
        this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any,index:number)=>{
          if(element.pack_type==row.pack_type){
            this.ELEMENT_DATA_CONSTRAINTS.splice(index,1);
            this.dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
          }
        });
      }
      }
  }

  setActivationCounter(){
    setTimeout(()=>{

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
// Accepts the array and key
export const groupByJson = (array:any[], key:string) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};

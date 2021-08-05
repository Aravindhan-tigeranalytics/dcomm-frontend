
import { Component, OnInit, ViewChild } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import {MatTableDataSource} from '@angular/material/table';
import { MaterialModule } from '../../material.module';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl} from '@angular/forms';
import { Options } from "@angular-slider/ngx-slider";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '@angular/material/paginator';
import {MatPaginator} from '@angular/material/paginator';
import * as Notiflix from 'notiflix';
import {Sort} from '@angular/material/sort';
import { ScenarioPlannerService } from 'src/app/backend-services/scenario-planner.service';

export interface ScenarioPlanner {
  position: number;
  activation_type: string;
  sku: number;
  expect_lift: number;
  expected_roi: number;
}
Notiflix.Notify.init({
  width:'300px',
  timeout: 3000,
  position:'right-top',
  cssAnimationStyle: 'from-bottom',
  distance:'20px',
  opacity: 1,
});

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss']
})

export class ScenarioComponent implements OnInit {

  selectedIndex:number = 0 //Tab Index
  @ViewChild(MatPaginator) paginator:any; // Table Paginator

  // Datatbale source setup  for the Scenerio planner
   ELEMENT_DATA: ScenarioPlanner[] = [];
  displayedColumns: string[] = ['select', 'position','sku', 'activation_type', 'expect_lift', 'expected_roi'];
  dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
  selection = new SelectionModel<ScenarioPlanner>(true, []);
  sortedData: ScenarioPlanner[]=[];
  skuList: ScenarioPlanner[] = [];
  activityType: ScenarioPlanner[] = [];
  activityLift:any = '';
  activityROI:any = '';
  // Datatbale source setup  for the Scenerio Optimiser
  OPTIMISER_DATA: ScenarioPlanner[] = [
    {position: 1,sku : 1235, activation_type: 'FSI', expect_lift: 13, expected_roi: 12},
    {position: 2,sku : 1235, activation_type: 'FAI', expect_lift: 32, expected_roi:  22},
    {position: 3,sku : 1235, activation_type: 'TPR', expect_lift: 20, expected_roi:  12},
    {position: 4,sku : 1235, activation_type: 'Search', expect_lift: 9, expected_roi: 32},
    {position: 5,sku : 1243, activation_type: 'FSI', expect_lift: 10 ,expected_roi: 12},
  ];
  displayedColumnsOptimiser: string[] = ['select', 'position','sku', 'activation_type', 'expect_lift', 'expected_roi'];
  dataSourceOptimiser = new MatTableDataSource<ScenarioPlanner>(this.OPTIMISER_DATA);
  sortedDataOptimiser: ScenarioPlanner[]=[];
  selectionOptimiser = new SelectionModel<ScenarioPlanner>(true, []);
  skuListOptimiser: ScenarioPlanner[] = [];
  activityTypeOptimiser: ScenarioPlanner[] = [];
  activityLiftOptimiser:any = '';
  activityROIOptimiser:any = '';
  // Configuration for the filters
  skuSelected:any = [1235,1243,1246]
  typeSelected:any = ['FSI','FAI','TPR','Search']
  liftMinValue: number = 0;
  liftMaxValue: number = 60;
  roiMinValue: number = 0;
  roiMaxValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  liftSliderValue:any = [5,60]
  roiSliderValue:any = [5,40]
  //END

  //Necessary initilizations
  skuActivationPlanData:any = '';
  rateCardInfoData:any ='';
  showScenarioPlanner:any = false;
  RateCardCount:number=0;
  SKUPlanCount:number=0;
  skus = new FormControl();
  types = new FormControl();
  alertRemove1:boolean=false;
  closeModal: any;
  totalActivities:number=0;
  totalProducts:number=0;
  //END
  constructor(private modalService: NgbModal,
    private apiServices:ScenarioPlannerService) {
    this.sortedData = this.ELEMENT_DATA.slice();
    this.sortedDataOptimiser = this.OPTIMISER_DATA.slice();
  }

  ngOnInit(): void {
    this.skuList = [...new Map(this.ELEMENT_DATA.map(item => [item["sku"], item])).values()];
    this.activityType = [...new Map(this.ELEMENT_DATA.map(item => [item["activation_type"], item])).values()];
    this.activityLift = this.liftSliderValue[0] + ' to ' + this.liftSliderValue[1];
    this.activityROI = this.roiSliderValue[0] + ' to ' + this.roiSliderValue[1];
    //Optimiser
    this.skuListOptimiser = [...new Map(this.OPTIMISER_DATA.map(item => [item["sku"], item])).values()];
    this.activityTypeOptimiser = [...new Map(this.OPTIMISER_DATA.map(item => [item["activation_type"], item])).values()];
    this.activityLiftOptimiser = this.liftSliderValue[0] + ' to ' + this.liftSliderValue[1];
    this.activityROIOptimiser = this.roiSliderValue[0] + ' to ' + this.roiSliderValue[1];

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      this.totalActivities=this.selection.selected.length;
      //console.log(this.selection.selected,"this.totalActivities");
      console.log(groupByJson(this.selection.selected,'sku'),"SKU group")
      this.totalProducts=Object.keys(groupByJson(this.selection.selected,'sku')).length;;
    },200);
  }
  async onFileSelected() {
    const inputNode: any = document.querySelector('#skufile');
    console.log(inputNode.files[0],"FILE");
    this.skuActivationPlanData = inputNode.files[0];
    let filename = inputNode.files[0].name;
    var extension:any = filename.substr(filename.lastIndexOf('.'));
    if((extension.toLowerCase() == ".xlsx") || (extension.toLowerCase() == ".xls") || (extension.toLowerCase() == ".csv")){
      this.SKUPlanCount=1;
      Notiflix.Notify.success('File Uploaded Successfully!');
      this.skuActivationPlanData['data']= await this.get_filebase64('skufile');
    }
    else{
      Notiflix.Notify.warning('Invalid File Format');
    }
    console.log(this.skuActivationPlanData,"FileDataset")
    const formdata = new FormData();
    formdata.append('file',inputNode.files[0])
  }

  async onRateFileSelected() {
    const inputNode: any = document.querySelector('#ratefile');
    console.log(inputNode.files[0])
    this.rateCardInfoData = inputNode.files[0]
    let filename = inputNode.files[0].name
    var extension:any = filename.substr(filename.lastIndexOf('.'));
    if((extension.toLowerCase() == ".xlsx") || (extension.toLowerCase() == ".xls") || (extension.toLowerCase() == ".csv")){
      console.log("good to go")
      this.RateCardCount=1;
      Notiflix.Notify.success('File Uploaded Successfully!');
      this.rateCardInfoData['data']= await this.get_filebase64('ratefile');
    }
    else{
      Notiflix.Notify.warning('Invalid File Format');
    }

    const formdata = new FormData();
    formdata.append('file',inputNode.files[0])
  }

  DownloadCSV(filename:string){
    if(this.selection.selected.length > 0){
      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: filename,
        useBom: true,
        noDownload: false,
        headers: ['S.No','SKU', 'Activation Type', 'Expect Lift', 'Expected ROI'],
        nullToEmptyString: true,
      };

      new Angular5Csv(this.selection.selected, filename, options);
    }
    else {
      Notiflix.Notify.warning('Please select atleast one product');
    }
  }

  executeScenarioPlanner(){
    let mandatoryCheck=false;
    if(this.skuActivationPlanData == ''){
      Notiflix.Notify.warning('Please Upload The SKU Activation Plan');
      mandatoryCheck=true;
      }else{
        mandatoryCheck=false;
      }
    if(this.rateCardInfoData == ''){
      Notiflix.Notify.warning('Please Upload The Rate Card Data');
      mandatoryCheck=true;
      }else{
        mandatoryCheck=false;
      }
      if(!mandatoryCheck){
        this.showScenarioPlanner =true;
        this.runScenarioPlanner();

      }

  }
  remove_skuplan(){
    let inputNode: any = document.querySelector('#skufile');
    if(this.SKUPlanCount>0){
      inputNode.files=undefined;
      this.skuActivationPlanData = '';
      this.SKUPlanCount=0;
    }
  }
  get_filebase64(fileId:any){

      let inputNode: any = document.querySelector('#'+fileId);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = res => {
          resolve(res.target?.result);
        };
        reader.onerror = err => reject(err);

        reader.readAsDataURL(inputNode.files[0]);
      });
  }
  remove_ratecard(){
    let inputNode: any = document.querySelector('#ratefile');
    console.log(inputNode,"INPUT")
    if(this.RateCardCount>0){
      console.log("log")
    inputNode.files=undefined;
    this.rateCardInfoData = '';
    this.RateCardCount=0;
    }

  }
  runScenarioPlanner(){
    Notiflix.Loading.dots('Processing...');
    this.selectedIndex = 0;
    setTimeout(()=>{
      Notiflix.Loading.remove();
      this.selectedIndex = 1;

      this.ELEMENT_DATA=[
        {position: 1,sku : 1235, activation_type: 'FSI', expect_lift: 13, expected_roi: 12},
        {position: 2,sku : 1235, activation_type: 'FAI', expect_lift: 32, expected_roi:  22},
        {position: 3,sku : 1235, activation_type: 'TPR', expect_lift: 20, expected_roi:  12},
        {position: 4,sku : 1235, activation_type: 'Search', expect_lift: 9, expected_roi: 32},
        {position: 5,sku : 1243, activation_type: 'FSI', expect_lift: 10 ,expected_roi: 12},
        {position: 6,sku : 1243, activation_type: 'FAI', expect_lift: 12, expected_roi: 12},
        {position: 7,sku : 1243, activation_type: 'TPR', expect_lift: 14, expected_roi: 14},
        {position: 8,sku : 1243, activation_type: 'Search', expect_lift: 15, expected_roi: 22},
        {position: 9,sku : 1246, activation_type: 'FSI', expect_lift: 18, expected_roi: 16},
        {position: 10,sku : 1246, activation_type: 'FAI', expect_lift: 20, expected_roi:  12},
        {position: 11,sku : 1235, activation_type: 'Search', expect_lift: 9, expected_roi: 32},
        {position: 12,sku : 1235, activation_type: 'Search', expect_lift: 9, expected_roi: 32},
        {position: 13,sku : 1235, activation_type: 'Search', expect_lift: 9, expected_roi: 32},
        {position: 14,sku : 1235, activation_type: 'Search', expect_lift: 9, expected_roi: 32},
      ];

    },1000);
    // this.apiServices.getPlannerData().subscribe((response)=>{
    //   console.log(response)

    // });
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
    this.ngAfterViewInit();
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


  doFilterOptimiser(){
    this.activityLiftOptimiser = this.liftSliderValue[0] + ' to ' + this.liftSliderValue[1];
    this.activityROIOptimiser = this.roiSliderValue[0] + ' to ' + this.roiSliderValue[1];
    let filterData:any = this.OPTIMISER_DATA.filter((data:any) => this.skuSelected.includes(data["sku"]));
    filterData = filterData.filter((data:any) => this.typeSelected.includes(data["activation_type"]));
    filterData = filterData.filter((o:any)=> {
      return o['expect_lift'] <= this.liftSliderValue[1] && o['expect_lift'] >= this.liftSliderValue[0];
    });
    filterData = filterData.filter((o:any)=> {
      return o['expected_roi'] <= this.roiSliderValue[1] && o['expected_roi'] >= this.roiSliderValue[0];
    });
    this.dataSourceOptimiser = new MatTableDataSource<ScenarioPlanner>(filterData);
    this.ngAfterViewInit();
  }
  sortOptimiserData(sort: Sort) {
    const data = this.OPTIMISER_DATA.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedDataOptimiser = data;
      return;
    }

    this.sortedDataOptimiser = data.sort((a:any, b:any) => {
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
    this.dataSourceOptimiser = new MatTableDataSource<ScenarioPlanner>(this.sortedDataOptimiser);
  }
  filterTableData(){
    console.log("filter data")
  }

  onTabChanged(event:any){
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    this.ngOnInit();
    this.ngAfterViewInit();
  }

}

// Used For Datatable sorting
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);

}
// Accepts the array and key
const groupByJson = (array:any[], key:string) => {
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

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl} from '@angular/forms';
import { Options } from "@angular-slider/ngx-slider";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import {MatPaginator} from '@angular/material/paginator';
import * as Notiflix from 'notiflix';

export interface PeriodicElement {
  position: number;
  activation_type: string;
  sku: number;
  expect_lift: number;
  expected_roi: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
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
];
Notiflix.Notify.init({
  width:'300px',
  timeout: 5000,
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

  selectedIndex:number = 0
  @ViewChild(MatPaginator) paginator:any;
  displayedColumns: string[] = ['select', 'position','sku', 'activation_type', 'expect_lift', 'expected_roi'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  skuActivationPlanData:any = ''
  rateCardInfoData:any =''

  showScenarioPlanner:any = false

  skus = new FormControl();
  skuList: PeriodicElement[] = [];

  types = new FormControl();
  activityType: PeriodicElement[] = [];

  activityLift:any = ''
  activityROI:any = ''

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

  closeModal: any;
  constructor(private modalService: NgbModal,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.skuList = [...new Map(ELEMENT_DATA.map(item => [item["sku"], item])).values()];
    this.activityType = [...new Map(ELEMENT_DATA.map(item => [item["activation_type"], item])).values()];
    this.activityLift = this.liftSliderValue[0] + ' to ' + this.liftSliderValue[1];
    this.activityROI = this.roiSliderValue[0] + ' to ' + this.roiSliderValue[1];
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
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.sku + 1}`;
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#skufile');
    console.log(inputNode.files[0])
    this.skuActivationPlanData = inputNode.files[0]
    let filename = inputNode.files[0].name
    var extension:any = filename.substr(filename.lastIndexOf('.'));
    if((extension.toLowerCase() == ".xlsx") || (extension.toLowerCase() == ".xls") || (extension.toLowerCase() == ".csv")){
      console.log("good to go")
      Notiflix.Notify.success('File Uploaded Successfully!');

    }
    else{
      Notiflix.Notify.warning('Invalid File Format');
    }

    const formdata = new FormData();
    formdata.append('file',inputNode.files[0])


    // if (typeof (FileReader) !== 'undefined') {
    //   const reader = new FileReader();

    //   reader.onload = (e: any) => {
    //     this.srcResult = e.target.result;
    //     console.log(this.srcResult)
    //   };

    //   reader.readAsArrayBuffer(inputNode.files[0]);
    // }
  }

  onRateFileSelected() {
    const inputNode: any = document.querySelector('#ratefile');
    console.log(inputNode.files[0])
    this.rateCardInfoData = inputNode.files[0]
    let filename = inputNode.files[0].name
    var extension:any = filename.substr(filename.lastIndexOf('.'));
    if((extension.toLowerCase() == ".xlsx") || (extension.toLowerCase() == ".xls") || (extension.toLowerCase() == ".csv")){
      console.log("good to go")
      Notiflix.Notify.success('File Uploaded Successfully!');
    }
    else{
      Notiflix.Notify.warning('Invalid File Format');
    }

    const formdata = new FormData();
    formdata.append('file',inputNode.files[0])
    // if (typeof (FileReader) !== 'undefined') {
    //   const reader = new FileReader();

    //   reader.onload = (e: any) => {
    //     this.srcResult = e.target.result;
    //   };

    //   reader.readAsArrayBuffer(inputNode.files[0]);
    // }
  }

  DownloadCSV(filename:string){
    console.log(this.selection.selected)
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
      this.toastr.warning('Please select atleast one product');
    }
  }

  executeScenarioPlanner(){
    if(this.skuActivationPlanData == ''){
      Notiflix.Notify.warning('Please Upload The SKU Activation Plan');
      //this.toastr.warning('');

      return
    }
    if(this.rateCardInfoData == ''){
      Notiflix.Notify.warning('Please Upload The Rate Card Data');
      return
    }
    this.showScenarioPlanner =true
    this.selectedIndex = 1
  }

  doFilter(){
    this.activityLift = this.liftSliderValue[0] + ' to ' + this.liftSliderValue[1];
    this.activityROI = this.roiSliderValue[0] + ' to ' + this.roiSliderValue[1];
    let filterData:any = ELEMENT_DATA.filter((data:any) => this.skuSelected.includes(data["sku"]));
    filterData = filterData.filter((data:any) => this.typeSelected.includes(data["activation_type"]));
    filterData = filterData.filter((o:any)=> {
      return o['expect_lift'] <= this.liftSliderValue[1] && o['expect_lift'] >= this.liftSliderValue[0];
    });
    filterData = filterData.filter((o:any)=> {
      return o['expected_roi'] <= this.roiSliderValue[1] && o['expected_roi'] >= this.roiSliderValue[0];
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(filterData);
    this.ngAfterViewInit();
  }

  filterTableData(){
    console.log("filter data")
  }

  onTabChanged(event:any){
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.ngOnInit();
    this.ngAfterViewInit();
  }

}

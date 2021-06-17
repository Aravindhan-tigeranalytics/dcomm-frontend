import { Component, OnInit, ViewChild } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl} from '@angular/forms';


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

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss']
})
export class ScenarioComponent implements OnInit {
  selectedIndex:number = 0

  displayedColumns: string[] = ['select', 'position','sku', 'activation_type', 'expect_lift', 'expected_roi'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  srcResult:any = ''

  skus = new FormControl();
  skuList: PeriodicElement[] = [];

  types = new FormControl();
  activityType: PeriodicElement[] = [];

  lifts = new FormControl();
  activityLift: PeriodicElement[] = [];

  rois = new FormControl();
  activityROI: PeriodicElement[] = [];

  skuSelected:any = [1235,1243,1246]
  typeSelected:any = ['FSI','FAI','TPR','Search']
  liftSelected:any = [13,32,20,9,10,12,14,15,18]
  roiSelected:any = [12,22,32,14,16]

  constructor() { }

  ngOnInit(): void {
    this.skuList = [...new Map(ELEMENT_DATA.map(item => [item["sku"], item])).values()];
    this.activityType = [...new Map(ELEMENT_DATA.map(item => [item["activation_type"], item])).values()];
    this.activityLift = [...new Map(ELEMENT_DATA.map(item => [item["expect_lift"], item])).values()];
    this.activityROI = [...new Map(ELEMENT_DATA.map(item => [item["expected_roi"], item])).values()];
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
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };
  
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  onRateFileSelected() {
    const inputNode: any = document.querySelector('#ratefile');
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };
  
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
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
  }

  executeScenarioPlanner(){
    this.selectedIndex = 1
  }

  doFilter(event:any){
    console.log(event.value)
    let filterData:any = ELEMENT_DATA.filter((data:any) => this.skuSelected.includes(data["sku"]));
    filterData = filterData.filter((data:any) => this.typeSelected.includes(data["activation_type"]));
    filterData = filterData.filter((data:any) => this.liftSelected.includes(data["expect_lift"]));
    filterData = filterData.filter((data:any) => this.roiSelected.includes(data["expected_roi"]));
    this.dataSource = new MatTableDataSource<PeriodicElement>(filterData);
  }

  filterTableData(){
    console.log("filter data")
  }

}

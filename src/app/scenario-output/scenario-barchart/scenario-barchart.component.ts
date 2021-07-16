import { EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
@Component({
  selector: 'app-scenario-barchart',
  templateUrl: './scenario-barchart.component.html',
  styleUrls: ['./scenario-barchart.component.scss']
})
export class ScenarioBarchartComponent implements OnInit {

  constructor() { }
  @Input() dataSetLabel: any=[];
  @Input() dataSet: any=[];

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: '#3f51b5' },
  ]
  barChartData: ChartDataSets[] = [];
  ngOnInit(): void {
    this.barChartLabels = this.dataSetLabel;
    this.barChartData = [this.dataSet];
    console.log("INIT");
  }

}

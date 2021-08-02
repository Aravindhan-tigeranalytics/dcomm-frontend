import { EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType ,Chart} from 'chart.js';
import { Color, Label, ChartsModule } from 'ng2-charts';
import * as pluginDataLabels from 'iro-chartjs-plugin-datalabels2';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-scenario-barchart',
  templateUrl: './scenario-barchart.component.html',
  styleUrls: ['./scenario-barchart.component.scss']
})
export class ScenarioBarchartComponent implements OnInit {
  currencySymbol: string;

  constructor() {
    this.currencySymbol=environment.currencySymbol;
  }
  @Input() dataSetLabel: any=[];
  @Input() dataSet: any=[];
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];
  barChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'top',  },
    layout: {
      padding: 20
  },
    scales: { xAxes: [{
      gridLines: {
        drawOnChartArea: false
    }
    }], yAxes: [{
        ticks: {
            callback: (label, index, labels)=> {
                return label+' '+this.currencySymbol;
            }
        },
        gridLines: {
          drawOnChartArea: false
      }
    },
  ] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 10
        },
        formatter: (value:any, ctx:any) => {
          var perc = value+" "+ this.currencySymbol;
          return perc;
         },
      }
    }
  };


  public barChartColors: Color[] = [
    { backgroundColor: 'rgb(255, 99, 132)' },
  ]
  barChartData: ChartDataSets[] = [];
  ngOnInit(): void {
    this.barChartLabels = this.dataSetLabel;
    this.barChartData = [this.dataSet];
    console.log("INIT");
  }

}
import { EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType ,Chart} from 'chart.js';
import { Color, Label, ChartsModule } from 'ng2-charts';
import * as pluginDataLabels from 'iro-chartjs-plugin-datalabels2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-optimizer-barchart',
  templateUrl: './optimizer-barchart.component.html',
  styleUrls: ['./optimizer-barchart.component.scss']
})
export class OptimizerBarchartComponent implements OnInit {
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

  barChartOptions: ChartOptions={}

  public barChartColors: Color[] = [
    {  },
  ]
  barChartData: ChartDataSets[] = [];
  ngOnInit(): void {
    this.barChartLabels = this.dataSetLabel;
    this.barChartData = [this.dataSet];
    console.log(this.dataSet,"this.dataSet");
    let yaxisConfig={};
    let pluginConf={};
    if(this.dataSet.label=='Incremental Revenue by Placement'){
      yaxisConfig={
        ticks: {
            callback: (label:any, index:any, labels:any)=> {

                return  numberWithCommas(label.toFixed())+' '+this.currencySymbol;
            }
        },
        gridLines: {
          drawOnChartArea: false
      }
    }
    pluginConf={
      datalabels: {
          anchor: 'end',
          align: 'end',
          font: {
            size: 10
          },
          formatter: (value:any, ctx:any) => {
            value=value.replace(/^0+/, '')
            var perc = numberWithCommas(value)+" "+ this.currencySymbol;
            return perc;
           },
        },

    }
    }else{
      yaxisConfig={
        ticks: {
          stepSize: 5,
          callback: (label:any, index:any, labels:any)=> {
              return label+' '+'%';

          }

      },
        gridLines: {
          drawOnChartArea: false
      }
    }
    pluginConf={
      datalabels: {
          anchor: 'end',
          align: 'end',
          font: {
            size: 10
          },
          formatter: (value:any, ctx:any) => {
            var perc = value+" %";
            return perc;
           },
        },
    }
    }
    this.barChartOptions = {
      responsive: true,
      legend: { display:false  },
      layout: {
        padding: 20
    },

      scales: { xAxes: [{
        gridLines: {
          drawOnChartArea: false
      }
      }], yAxes: [yaxisConfig] },
      plugins: pluginConf
    };

  }

}


function numberWithCommas(x:number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

import { Observable, Subscription } from 'rxjs';
import { DataControllerService } from '../../base/data-controller/data-controller.service';
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
import { ScenarioPlannerService } from '../../backend-services/scenario-planner.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
export interface ScenarioPlanner {
  pack_type: string;
  pack_sub_type:string;
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
  period: string;
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
  styleUrls: ['./scenario-planning.component.scss'],
  animations: [
    trigger("changeDivSize", [
      state(
        "initial",
        style({
          backgroundColor: "green",
          width: "100px",
          height: "100px"
        })
      ),
      state(
        "final",
        style({
          backgroundColor: "red",
          width: "200px",
          height: "200px"
        })
      ),
      transition("initial=>final", animate("1500ms")),
      transition("final=>initial", animate("1000ms"))
    ]),

    trigger("balloonEffect", [
      state(
        "initial",
        style({
          backgroundColor: "green",
          transform: "scale(1)"
        })
      ),
      state(
        "final",
        style({
          backgroundColor: "red",
          transform: "scale(1.5)"
        })
      ),
      transition("final=>initial", animate("1000ms")),
      transition("initial=>final", animate("1500ms"))
    ]),

    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0
        })
      ),
      transition("void <=> *", animate(1000))
    ]),

    trigger("EnterLeave", [
      state("flyIn", style({ transform: "translateX(0)" })),
      transition(":enter", [
        style({ transform: "translateX(-100%)" }),
        animate("0.5s 300ms ease-in")
      ]),
      transition(":leave", [
        animate("0.3s ease-out", style({ transform: "translateX(100%)" }))
      ])
    ])
  ]
})

export class ScenarioPlanningComponent implements OnInit {

  RateCardCount: number=0;
  rateCardInfoData: any;
  financialsData: any;
  currencySymbol:string='';
  financialsCount: number=0;
  response_data=[];
  private _jsonURL = '../../assets/json_data/json_data.json';
  promocodeSubscriber: any;
  ratecardSubscribe: any;
  constructor(private modalService: NgbModal,
    private routes:Router,
    private apiServices:ScenarioPlannerService,
    private dataservice:DataControllerService,
    private http: HttpClient,
    ) {
      Notiflix.Notify.init({
        width:'300px',
        timeout: 3000,
        position:'right-bottom',
      });
      // this.getJSON().subscribe(data => {
      //   this.response_data=data;
      //   console.log(this.response_data,"this.response_data")
      //  });
      this.currencySymbol=environment.currencySymbol;
    let input=this.routes.getCurrentNavigation()?.extras.state;
    if(input){
    if(typeof(input)!=undefined){
      this.datastream=this.routes.getCurrentNavigation()?.extras.state ;

    }
  }
  this.dataservice.LoginState(true);
  }
  // public getJSON(): Observable<any> {
  //   return this.http.get(this._jsonURL);
  // }
  ELEMENT_DATA: ScenarioPlanner[] = [];
  ELEMENT_DATA_CONSTRAINTS:any=[];
  //'fsi', 'fai','search', 'sot', 'bpp'
  Ratecardjson:any;
  PROMOCODE_LIST:any={};
  datastream:any;
  binaryOption=[
  {id: 'Yes', name: "Yes"},
  {id: 'No', name: "No"},]
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  promoCodeList:any=[ {id: 'SELECT', name: "--SELECT--"},];
  promoCodeDesc:any=[ {id: 'SELECT', name: "--SELECT--"},];
  displayedColumns: string[] = ['select', 'pack_type','pack_sub_type','product_tpn', 'product_name', 'list_price',
  'promotion_type','promotion','discount','edlp','selling_price'];
  dataSource:any;
  displayedColumnsConstraints: string[] = ['pack_type','fsi', 'fai','search', 'sot', 'bpp'];
  dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
  selection = new SelectionModel<ScenarioPlanner>(true, []);
  sortedData: ScenarioPlanner[]=[];
  skuList: ScenarioPlanner[] = [];
  activityType: ScenarioPlanner[] = [];
  PeroidList:any=[];
  activePeroid:string='';
  activityLift:any = '';
  DynActivationColumns:any={};
  activityROI:any = '';
  closeModal: any;
  search_tag:string='';
  liftSliderValue:any = [5,60];
  roiSliderValue:any = [5,40];
    // Configuration for the filters
  skuSelected:any = [1235,1243,1246];
  types = new FormControl();
  typeSelected:any = [];
  plannerSubscriber:any;
  name = 'This is XLSX TO JSON CONVERTER';
  willDownload = false;
  setDefaultMonth(){
    const d = new Date();
    console.log(this.PeroidList,"==",d.getMonth());
    console.log(this.PeroidList[d.getMonth()],"data")
    this.activePeroid=this.PeroidList[d.getMonth()].value;

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.plannerSubscriber.unsubscribe();
    this.promocodeSubscriber.unsubscribe();
  }
  ngOnInit(): void {
    this.promocodeSubscriber = this.dataservice.PromoCodeOb.subscribe((message:any) => {
      if(message){
        this.PROMOCODE_LIST = message;
        this.dataservice.setPromoCode(this.PROMOCODE_LIST);
        Object.keys(this.PROMOCODE_LIST).forEach(element => {
          this.promoCodeList=[];
          this.promoCodeList.push({'id':element,'name':element});
        });
      }
      this.ELEMENT_DATA.forEach((element)=>{
        element.promotion_type_list=this.promoCodeList;
      });
    });
    console.log(this.PROMOCODE_LIST,"this.PROMOCODE_LIST");
    this.plannerSubscriber=this.apiServices.getPlannerData().subscribe((res:any)=>{
      Notiflix.Loading.dots('Loading...');
      if((res['code']=='200') && (res.status=='success')){
      console.log(res.data,"response");
      this.ELEMENT_DATA=[];
      res.data.forEach((element:any) => {
        element.promotion_list=[];
        element.promotion_type_list=[];
        this.ELEMENT_DATA.push(element);
      });
      this.PeroidList=res.misc.peroid_list;
      this.setDefaultMonth();
      this.DynActivationColumns=res.misc.activation_list;
      console.log(this.ELEMENT_DATA,"this.ELEMENT_DATA");
      this.activityType = [...new Map(this.ELEMENT_DATA.map(item => [item["pack_type"], item])).values()];
      this.typeSelected =this.activityType.map(item => item["pack_type"]);
      console.log(this.typeSelected);
      this.setDefaultSellingPrice();
      this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
      this.ratecardSubscribe = this.dataservice.RatecardOb.subscribe((ratecard:any) => {
        if(ratecard){
          console.log(ratecard,"ratecard");
          this.Ratecardjson=ratecard;
          this.RateCardCount=1;
        }
      });
  }
  if(this.datastream){

  if(this.datastream.source=='from_activation'){
    let selectedItems=this.datastream.data[0] || [];
    let Promolist=this.datastream.data[1] || [];
    this.Ratecardjson=this.datastream.data[2] || [];
     let grouped=groupByJson(selectedItems,'product_tpn');
     let grouped_keys=Object.keys(grouped);
     this.dataSource.data.forEach((row:any) => {
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
          //row.promotion_type_list= grouped[grouped_keys[0]][0].promotion_type_list;
          //this.PROMOCODE_LIST=grouped[grouped_keys[0]][0].promotion_type_list;
       }
       //this.PROMOCODE_LIST=Promolist;
     });
     console.log(selectedItems,"selectedItems")
    }


    if(this.datastream.source=='from_opt_activation'){
      let selectedItems=this.datastream.data[0] || [];
      let Promolist=this.datastream.data[1] || [];
       let grouped=groupByJson(selectedItems,'product_tpn');
       let grouped_keys=Object.keys(grouped);
       this.dataSource.data.forEach((row:any) => {
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
            //row.promotion_type_list= grouped[grouped_keys[0]][0].promotion_type_list;
            //this.PROMOCODE_LIST=grouped[grouped_keys[0]][0].promotion_type_list;
         }
         //this.PROMOCODE_LIST=Promolist;
       });
      }
  }
  Notiflix.Loading.remove();
  });
}
changePeroidList(event:any){
 // console.log(this.activePeroid,"PEROID");
  this.ELEMENT_DATA.forEach((ele)=>{
    ele.period=this.activePeroid;
  });
}
optimizeScenario(){
  // let payload={ 'rate_card':this.Ratecardjson['RateCard'],
  //               'financials':this.financialsData,
  //               'products':this.selection.selected,
  //               'planner_type':'simulation'};
  let purged_list=JSON.parse(JSON.stringify(this.selection.selected));
  purged_list.forEach((item:any)=>{
    item.promotion_list=[];
    item.promotion_type_list=[];
  });

  let payload={'rate_card':this.Ratecardjson['RateCard'],
  'products':purged_list,
  'planner_type':'optimizer',
  'job_token':'JWT '+localStorage.getItem('token')};
  let code='';
  let mandatory=false;
  if(this.activePeroid==''){
    mandatory=true;
    code='peroid';
  }
  if(this.selection.selected.length==0){
    mandatory=true;
    code='records';
  }
  if(!mandatory){
    this.selection.selected.forEach((ele)=>{
      ele.period=this.activePeroid;
    });
      this.routes.navigate(['/optimizer'],{ state: {'source':'from_planning','data':[this.ELEMENT_DATA_CONSTRAINTS,this.selection.selected,this.PROMOCODE_LIST,this.response_data]}});
    //  });
  }else{
    if(code=='records'){
      Notiflix.Notify.info('Please select the records');
    }else if(code=='peroid'){
      Notiflix.Notify.info('Please select the peroid');
    }
  }
}
simulateScenario(){

  let code='';
  let mandatory=false;
  if(this.activePeroid==''){
    mandatory=true;
    code='peroid';
  }
  if(this.selection.selected.length==0){
    mandatory=true;
    code='records';
  }
  if(this.RateCardCount==0){
    mandatory=true;
    code='ratecard';
  }
  if(!mandatory){
    this.selection.selected.forEach((ele)=>{
      ele.period=this.activePeroid;
    });
  let purged_list=JSON.parse(JSON.stringify(this.selection.selected));
  purged_list.forEach((item:any)=>{
    item.promotion_list=[];
    item.promotion_type_list=[];
  });
  let payload={ 'rate_card':this.Ratecardjson['RateCard'],
  'financials':this.financialsData,
  'products':purged_list,
  'planner_type':'simulation'};
  let payload1={ 'rate_card':this.Ratecardjson['RateCard'],
  'products':purged_list,
  'planner_type':'simulation',
'job_token':'JWT '+localStorage.getItem('token')};
    Notiflix.Loading.dots('Loading...');
    // setTimeout(()=>{
    //   Notiflix.Loading.remove();
    // },20000)
    let start=0;
    // let timer=setInterval(()=>{
    //   start=start+5;
    //   Notiflix.Loading.change('Loading... '+start+'%');
    //   if(start==95){
    //     Notiflix.Loading.change('Processing....');
    //     clearTimeout(timer);
    //   }

    // },1000)
    console.log(payload,"payload");
        this.apiServices.get_trans_scenatio_planner_simulate(payload1).subscribe((res:any)=>{
       console.log(res,"response");
       if(res.status=='success'){
        this.response_data=res.data;
        Notiflix.Loading.remove();
          this.routes.navigate(['/simulator'],{ state: {'source':'from_planning','data':[this.ELEMENT_DATA_CONSTRAINTS,
          this.selection.selected,this.PROMOCODE_LIST,this.response_data, this.Ratecardjson]}});

       }else if(res.status=='databricks_error'){
        Notiflix.Loading.remove();
        Notiflix.Notify.failure('Failed to process with inputs')
       }
      });


      //  Notiflix.Loading.remove();
      //  this.routes.navigate(['/simulator'],{ state: {'source':'from_planning','data':[this.ELEMENT_DATA_CONSTRAINTS,
      //   this.selection.selected,this.PROMOCODE_LIST,this.response_data,
      // this.Ratecardjson]}});

  }else{
    if(code=='records'){
      Notiflix.Notify.info('Please select the records');
    }else if(code=='peroid'){
      Notiflix.Notify.info('Please select the peroid');
    }else if(code=='ratecard'){
      Notiflix.Notify.info('Please upload the ratecard');
    }
  }

}


testData(){

}
ngAfterViewInit(){

}

downloadRateCardTemplate(){
  let payload={'download_code':'rate_card_template'};
  this.apiServices.download_excel(payload).subscribe((blob)=>{
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = 'Rate Card Template.xlsx';
    a.click();
    URL.revokeObjectURL(objectUrl);
    });
}
downloadFinTemplate(){
  let payload={'download_code':'finance_template'};
  this.apiServices.download_excel(payload).subscribe((blob)=>{
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = 'Financials Template.xlsx';
    a.click();
    URL.revokeObjectURL(objectUrl);
    });
}
downloadPromotionTemplate(){
  let payload={'download_code':'promotion_template'};
  this.apiServices.download_excel(payload).subscribe((blob)=>{
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = 'Promotion Template.xlsx';
    a.click();
    URL.revokeObjectURL(objectUrl);
    });
}
decrementRange(value:any){
  if(value.discount<=5){
    value.discount=0;
  }else{
    value.discount=parseInt(value.discount)-5;
  }
  this.setSellingPrice(value);
  return value.discount
}
incrementRange(value:any){
  if(value.discount>=95){
    value.discount=100;
  }else{
    value.discount=parseInt(value.discount)+5;

  }
  this.setSellingPrice(value);
}
doFilter(){
    let filterData= this.ELEMENT_DATA.filter((data:any) => this.typeSelected.includes(data["pack_type"]));
    if(this.search_tag.trim()!=''){
      let gblFilter=this.search_tag.toLowerCase();
      filterData = filterData.filter((data:any) => data["product_name"].toLowerCase().substring().includes(gblFilter)
      );
    }
    this.dataSource = new MatTableDataSource<ScenarioPlanner>(filterData);
  }
  clear_search(){
    this.search_tag='';
    this.doFilter();
  }
  resetFilter(){
    // this.dataSource = new MatTableDataSource<ScenarioPlanner>(this.ELEMENT_DATA);
    // this.typeSelected =this.activityType.map(item => item["pack_type"]);
    this.ngOnInit();
    let inputNode: any = document.querySelector('#ratefile');
    if(this.RateCardCount>0){
      inputNode.value='';
      this.Ratecardjson = '';
      this.RateCardCount=0;
    }
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
      let groupedPCode=groupByJson(promoList['Promotion Code List'],'Promotion_Type');
      this.PROMOCODE_LIST=groupedPCode;
      this.dataservice.setPromoCode(this.PROMOCODE_LIST);
      console.log(this.PROMOCODE_LIST,"Promolist");
      Object.keys(groupedPCode).forEach(element => {
        this.promoCodeList.push({'id':element,'name':element});
      });

      this.ELEMENT_DATA.forEach((element)=>{
        element.promotion_type_list=this.promoCodeList;
      });
    }catch(exception){
      Notiflix.Notify.info('Invalid File Format');
    }

  }
  // Updation the promo desc dropdown for the based on the selected promocode
    setPromoDesc(selected:any,element:any){
      if(selected!='SELECT'){
        console.log(this.PROMOCODE_LIST,"PROMOCODE_LIST")
        this.promoCodeDesc=this.PROMOCODE_LIST[selected];
        element.promotion_list=this.PROMOCODE_LIST[selected];
        element.edlp='No';
      }else{
        element.promotion_list=[];
        element.promotion='';
        element.edlp='Yes';
      }
      this.setSellingPrice(element);
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
      element.discount=0;
  }
  if(element.promotion_type!='SELECT' && element.edlp=='No'){
      let calculated_price=element.list_price-((element.discount/100)*(element.list_price));
      if(calculated_price){
        element.selling_price=parseFloat(calculated_price.toFixed(2));
      }else{
        element.selling_price=element.list_price;
      }

  }
  let toChange=element.pack_sub_type;
  this.ELEMENT_DATA.forEach((item)=>{
    if(item.pack_sub_type==toChange){
      //gbl_selling_price
        item.selling_price=element.selling_price;
        item.promotion_type=element.promotion_type;
        item.promotion=element.promotion;
        item.list_price=element.list_price;
        item.edlp=element.edlp;
        item.promotion_list=element.promotion_list;
        if(element.discount){
          item.discount=element.discount;
        }else{
          item.discount=0;
        }
    }

  });

  }
  // Update the Promotion Code Discount based on the Desc Selected
  updateDiscount(event:any,row:any){
    let discounted=((event.value/row.list_price)*100).toFixed(2);
    if(discounted){
      row.discount=100-parseInt(discounted);
    }
    this.setSellingPrice(row);
  }
  updateDiscount_price(event:any,row:any){
    if(row.promotion!='No'){

      let discounted=((row.promotion/event.target.value)*100).toFixed(2);
      if(discounted!='NaN'){
        row.discount=100-parseInt(discounted);
        console.log(discounted,"discounted")
      }else{
        row.discount=0;
      }

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
      workBook =XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial:any, name:any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
       const dataString = JSON.stringify(jsonData);
       resolve(jsonData);
       return jsonData
    }
     reader.readAsBinaryString(file);
    });
      }
  changeConstraint(row:any){
    let jsonObject=groupByJson(this.ELEMENT_DATA_CONSTRAINTS,'pack_sub_type');
    let availList:any=Object.keys(jsonObject);
    if(!availList.includes(row.pack_sub_type)){
      let object:any={'pack_sub_type':row.pack_sub_type};
      this.DynActivationColumns.forEach((element:any) => {
        object[element.value]=false;
      });
      console.log(object,"object")
      this.ELEMENT_DATA_CONSTRAINTS.push(object);
      //this.DynActivationColumns
      console.log(this.DynActivationColumns,"DynActivationColumns");
      this.dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
     }
     else{
      if(jsonObject[row.pack_sub_type].length==3){
        this.ELEMENT_DATA_CONSTRAINTS.forEach((element:any,index:number)=>{
          if(element.pack_sub_type==row.pack_sub_type){
            this.ELEMENT_DATA_CONSTRAINTS.splice(index,1);
            this.dataSourceConstraints = new MatTableDataSource<ScenarioPlannerConstraint>(this.ELEMENT_DATA_CONSTRAINTS);
          }
        });
      }
      }
  }
  async onRateFileSelected(event:any) {
    const inputNode: any = document.querySelector('#ratefile');
    this.Ratecardjson=await this.onFileChange(event);

    if(this.Ratecardjson.hasOwnProperty('RateCard')){

    this.rateCardInfoData = inputNode.files[0]
    let filename = inputNode.files[0].name
    var extension:any = filename.substr(filename.lastIndexOf('.'));
    if((extension.toLowerCase() == ".xlsx") || (extension.toLowerCase() == ".xls") || (extension.toLowerCase() == ".csv")){
      this.RateCardCount=1;
      Notiflix.Notify.success('RateCard Added Successfully!');
      this.rateCardInfoData['data']= await this.get_filebase64('ratefile');
      this.dataservice.setRatecard(this.Ratecardjson);
    }
    else{
      Notiflix.Notify.info('Invalid File Format');
    }

    const formdata = new FormData();
    formdata.append('file',inputNode.files[0]);

    console.log(this.Ratecardjson['RateCard'],"this.Ratecardjson")
  }else{
    Notiflix.Notify.info('Please upload the rate card');
  }
  }
  async onFinancialsSelected() {
    const inputNode: any = document.querySelector('#finfile');
    console.log(inputNode.files[0],"FILE");
    this.financialsData = inputNode.files[0];
    let filename = inputNode.files[0].name;
    var extension:any = filename.substr(filename.lastIndexOf('.'));
    if((extension.toLowerCase() == ".xlsx") || (extension.toLowerCase() == ".xls") || (extension.toLowerCase() == ".csv")){
      this.financialsCount=1;
      Notiflix.Notify.success('Financials Added Successfully!');
      this.financialsData['data']= await this.get_filebase64('finfile');
      //
    }
    else{
      Notiflix.Notify.info('Invalid File Format');
    }
    console.log(this.financialsData,"FileDataset")
    const formdata = new FormData();
    formdata.append('file',inputNode.files[0])
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

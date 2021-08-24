import { Component, OnInit } from '@angular/core';
import { ScenarioPlannerService } from '../backend-services/scenario-planner.service';
import { DataControllerService } from '../base/data-controller/data-controller.service';
import jwt_decode from "jwt-decode";
import * as Notiflix from 'notiflix';
import { Router } from '@angular/router';
Notiflix.Notify.init({
  position:'right-bottom',
  timeout:3000
});
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  RetailerListSubscriber: any;
  RetailerList:any;
  username:any;
  selectedRetailer:any={}
  constructor(private dataservice:DataControllerService,
    private apiServices:ScenarioPlannerService,
    private router:Router,) {
    this.dataservice.LoginState(true);
  }

  ngOnInit(): void {
    this.RetailerListSubscriber=this.apiServices.get_retailer_list().subscribe((res:any)=>{
      if((res['code']=='200') && (res.status=='success')){
        this.RetailerList=res.data;
      }
    });
    let token:any=localStorage.getItem('token') ;
      try{
        var decoded:any = jwt_decode(token);
        //console.log(decoded,"decoded");
        this.username=decoded.username || '';
      }catch{
         //console.log("ERROR TOKEN");
      }
  }
  selectedRetailers(event:any,item:any){
    if(event.checked){
      this.selectedRetailer[item.id]=item.value
    }else{
      delete this.selectedRetailer[item.id];
    }
  }
  getSelectedRetailers(){
console.log(Object.keys(this.selectedRetailer),"this.selectedRetailer");
if(Object.keys(this.selectedRetailer).length!=0){
  this.router.navigate(['/planner']);
}else{
  Notiflix.Notify.info('Please select the retailer');
}
  }
  ngOnDestroy(): void {
    this.RetailerListSubscriber.unsubscribe();
  }
}

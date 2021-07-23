import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { Subscription } from 'rxjs';

import { DataControllerService } from '../data-controller/data-controller.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private routes:Router,
    private dataservice:DataControllerService) { }
  username:string='';
  loggedin:boolean=false;
  subscription: Subscription | undefined;
  ngOnInit(): void {
    this.subscription = this.dataservice.LoginStateOb.subscribe((message:any) => {
      this.loggedin = message;
      let token:any=localStorage.getItem('token') ;
      try{
        var decoded:any = jwt_decode(token);
        console.log(decoded,"decoded");
        this.username=decoded.username || '';
      }catch{
         console.log("ERROR TOKEN");
      }
    });
  }
   logout(){
    localStorage.setItem('token','');
    this.routes.navigate(['/login']);
    this.dataservice.LoginState(false);
   }
   ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

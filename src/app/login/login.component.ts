import { DataControllerService } from './../data-controller/data-controller.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../backend-services/auth.services';
import { Subscription } from 'rxjs';
import Notiflix from 'notiflix';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private service:AuthService,
    private router:Router,
    private dataservice:DataControllerService) { }
  username='';
  password='';
  ngOnInit(): void {
    this.dataservice.LoginState(false);
  }

  login(){

    let formData: FormData = new FormData();
    formData.append('username',this.username);
    formData.append('password', this.password);
    Notiflix.Loading.dots('Loading...');
    this.service.login(formData).subscribe((res:any)=>{
      console.log(res,"res");
      if(res.token){
        localStorage.setItem('token',res.token);
        setTimeout(()=>{
          this.router.navigate(['/planner']);
          this.dataservice.LoginState(true);
          Notiflix.Loading.remove();
        },50);

      }else{

        localStorage.setItem('token','');
        this.router.navigate(['login']);
        this.dataservice.LoginState(false);
        Notiflix.Loading.remove();
      }
    });
  }
}

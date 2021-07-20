import { DataControllerService } from './../data-controller/data-controller.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../backend-services/auth.services';
import { Subscription } from 'rxjs';

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

  }

  login(){

    let formData: FormData = new FormData();
    formData.append('username',this.username);
    formData.append('password', this.password);
    this.service.login(formData).subscribe((res:any)=>{
      console.log(res,"res");
      if(res.token){
        localStorage.setItem('token',res.token);
        setTimeout(()=>{
          this.router.navigate(['/']);
          this.dataservice.LoginState(true);
        },500);

      }else{

        localStorage.setItem('token','');
        this.router.navigate(['login']);
        this.dataservice.LoginState(false);
      }
    })
  }
}

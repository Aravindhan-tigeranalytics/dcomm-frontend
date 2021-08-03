import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {  HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import * as Notiflix from 'notiflix';
@Injectable({
  providedIn: 'root'
})

export class InterceptorService implements HttpInterceptor {
  constructor(private routes:Router){

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let userToken='JWT '+localStorage.getItem("token") || '';
    const modifiedReq = request.clone({
      headers: request.headers.set('Authorization', `${userToken}`),
    });
    return next.handle(modifiedReq)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
          }
          else {
           if(error.status==401){
            this.routes.navigate(['/login']);
           }else if(error.status==400){
             //Auth Login handle the error failure
            if(error.url?.includes('auth_login')){
              Notiflix.Notify.failure('Username/Password is wrong');
            }
          }
          }
          return throwError(errorMsg);
        })
      )
  }
}

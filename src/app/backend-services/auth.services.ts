import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serviceURL:string=''
  constructor(private http: HttpClient) {
    this.serviceURL=environment.serviceURL;
  }
  header = new HttpHeaders()

  login(payload:any) {
    return this.http.post(this.serviceURL+'/auth_login/', payload ,{headers:this.header});
}


}

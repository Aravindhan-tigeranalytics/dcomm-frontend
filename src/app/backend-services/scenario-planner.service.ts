import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScenarioPlannerService {
  serviceURL:string=''
  constructor(private http: HttpClient) {
    this.serviceURL=environment.serviceURL;
  }

  getPlannerData() {
    return this.http.get(this.serviceURL+'/scenario_planner/');
}


}

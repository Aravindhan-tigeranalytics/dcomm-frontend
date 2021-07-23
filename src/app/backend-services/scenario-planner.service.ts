import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ScenarioPlannerService {
  serviceURL:string=''
  constructor(private http: HttpClient) {
    this.serviceURL=environment.serviceURL;
  }
  download_excel(payload:any) {
    return this.http.post(this.serviceURL+'/scenario_planner/download_file',{ params: payload },{'responseType':'blob'});
  }
  getPlannerData() {
    return this.http.get(this.serviceURL+'/scenario_planner/get_product_details');
  }
  scenatio_planner_simulate(payload:any) {
    return this.http.post(this.serviceURL+'/scenario_planner/simulate_scenario',{ params: payload });
  }

}

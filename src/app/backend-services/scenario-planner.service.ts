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
  getActivationList() {
    return this.http.get(this.serviceURL+'/scenario_planner/get_activationlist');
  }
  getpackTypeList() {
    return this.http.get(this.serviceURL+'/scenario_planner/activationlist');
  }
  //get_activationlist
  scenatio_planner_simulate(payload:any) {
    return this.http.post(this.serviceURL+'/scenario_planner/simulate_scenario',{ params: payload });
  }
//save scenario
scenario_planner_simulate_save(payload:any) {
  return this.http.post(this.serviceURL+'/scenario_planner/planner_data', payload );
}
// list save scenario
scenario_planner_list() {
  return this.http.get(this.serviceURL+'/scenario_planner/planner_data' );
}
//scenario_planner/planner_datas_detail/
// list save scenario
scenario_planner_listdetails(payload:number) {
  return this.http.get(this.serviceURL+'/scenario_planner/planner_datas_detail/'+payload );
}
//delete
scenario_planner_listdelete(payload:number) {
  return this.http.delete(this.serviceURL+'/scenario_planner/planner_datas_detail/'+payload );
}
//delete
get_processed_data(payload:any) {
  return this.http.post(this.serviceURL+'/scenario_planner/groupped_planner_data',payload );
}

//simulate scenario  scenario_planner/transaction_simulate_scenario

get_trans_scenatio_planner_simulate(payload:any) {
  return this.http.post(this.serviceURL+'/scenario_planner/transaction_simulate_scenario',{ params: payload } );
}

get_trans_scenatio_planner_optimizer(payload:any) {
  return this.http.post(this.serviceURL+'/scenario_planner/transaction_optimizer_scenario',{ params: payload } );
}

get_retailer_list() {
  return this.http.get(this.serviceURL+'/scenario_planner/get_retailers' );
}

}

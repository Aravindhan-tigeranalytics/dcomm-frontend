import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataControllerService {

  private LoginStateObject:any = new BehaviorSubject(false);
  LoginStateOb = this.LoginStateObject.asObservable();

  constructor() { }

  LoginState(state: any) {
    this.LoginStateObject.next(state)
  }
}

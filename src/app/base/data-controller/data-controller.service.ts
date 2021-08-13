import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataControllerService {

  private LoginStateObject:any = new BehaviorSubject(false);
  LoginStateOb = this.LoginStateObject.asObservable();

  private PromoCodeObject:any = new BehaviorSubject(false);
  PromoCodeOb = this.PromoCodeObject.asObservable();

  private RatecardObject:any = new BehaviorSubject(false);
  RatecardOb = this.RatecardObject.asObservable();

  private ElementCostObject:any = new BehaviorSubject(false);
  ElementCostOb = this.ElementCostObject.asObservable();

  private BudgetConstraintObject:any = new BehaviorSubject(false);
  BudgetConstraintOb = this.BudgetConstraintObject.asObservable();
  constructor() { }

  LoginState(state: any) {
    this.LoginStateObject.next(state)
  }
  setPromoCode(state: any) {
    this.PromoCodeObject.next(state)
  }
  setRatecard(state: any) {
    this.RatecardObject.next(state)
  }
  setElementCost(state: any) {
    this.ElementCostObject.next(state)
  }
  setBudgetConstraint(state: any) {
    this.BudgetConstraintObject.next(state)
  }
}

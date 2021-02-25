import { ConfigService } from './config.service';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AccountwithdrawalService {
  // /* Define variables */
  constructor(private http: HttpClient, private config: ConfigService) {}

  getResources() {
    return this.http
      .get(`${environment.apiOperator}/v1/withdrawalresourses`)
      .pipe(map((data) => data));
  }

  sendWithdrawal(data) {
    return this.http
      .post(`${environment.oldOperator}/v1/transferwithdrawal`, data)
      .pipe(map((data) => data));
  }

  validateRetention(data){
    return this.http
      .post(`${environment.apiOperator}/v1/validretention`, data)
      .pipe(map((data) => data));
  }
}

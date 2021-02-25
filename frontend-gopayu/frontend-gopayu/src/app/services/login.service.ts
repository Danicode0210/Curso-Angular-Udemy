import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  // /* Define variables */
  constructor(private http: HttpClient, private config: ConfigService) {}

  login(_data) {
    return this.http
      .post(`${environment.apiOperator}/accounts/sessions`, _data, {
        observe: "response",
        headers: new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8",
        }),
      })
      .pipe((res) => {
        return res;
      });
  }

  recoveryPass(_email) {
    return this.http
      .post(
        `${environment.apiOperator}/accounts/${_email}/forgotten-password-email`,
        {},
        {
          observe: "response",
          headers: new HttpHeaders({
            "Content-Type": "application/json; charset=utf-8",
          }),
        }
      )
      .pipe((res) => {
        return res;
      });
  }

  updatePassword(password, securityKey) {
    var dataSend = {
      securityKey: securityKey,
      newPassword: password,
    };

    return this.http
      .post(
        `${environment.apiOperator}/accounts/forgotten-password-reset`,
        dataSend,
        {
          observe: "response",
          headers: new HttpHeaders({
            "Content-Type": "application/json; charset=utf-8",
            "X-Sisplay-Header": "true",
          }),
        }
      )
      .pipe((res) => {
        return res;
      });
  }

  acceptTerms(_authToken) {
    return this.http
      .post(
        `${environment.apiOperator}/accounts/me/sessions/accept-terms`,
        {
          termsAcceptId: 1,
        },
        {
          observe: "response",
          headers: new HttpHeaders({
            "Content-Type": "application/json; charset=utf-8",
            Authorization: _authToken,
          }),
        }
      )
      .pipe((res) => {
        return res;
      });
  }

  logout(_authToken) {
    return this.http
      .delete(`${environment.apiOperator}/accounts/me/sessions`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8",
          Authorization: _authToken,
        }),
      })
      .pipe(map((data) => data));
  }

  refreshToken() {
    return this.http
      .post(`${environment.apiOperator}/accounts/me/sessions/refresh`, {})
      .pipe(map((data) => data));
  }
  isVIP(data) {
    return this.http
      .post(`${environment.dataUrl}/fnt/valida-mayor`, JSON.stringify(data), {
        observe: "response",
        headers: new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8",
          secretKey: "testFR",
        }),
      })
      .pipe((res) => {
        return res;
      });
  }
  getProfile(_accessToken) {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/profile`, {
        observe: "response",
        headers: new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8",
          Authorization: _accessToken,
        }),
      })
      .pipe((res) => {
        return res;
      });
  }

  isVIPFlag() {
    return this.http
      .get(`/i18n/es.json`, {
        observe: "response",
        headers: new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8",
        }),
      })
      .pipe((res) => {
        return res;
      });
  }

  getBalance(_accessToken) {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/balance`, {
        observe: "response",
        headers: new HttpHeaders({
          "Content-Type": "application/json; charset=utf-8",
          Authorization: _accessToken,
        }),
      })
      .pipe((res) => {
        return res;
      });
  }
}

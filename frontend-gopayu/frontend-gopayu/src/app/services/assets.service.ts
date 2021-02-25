import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AssetsService {
  /* Define variables */
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
    }),
  };

  constructor(private http: HttpClient) {}

  getLogo(_type) {
    return this.http
      .get(
        `${environment.apiUrl}/appearance/get-feature-logo/${_type}`,
        this.httpOptions
      )
      .pipe(map((data) => data));
  }

  getCurrentTime() {
    return this.http
      .get(
        `${environment.apiOperator}/currentTime`,
        this.httpOptions
      )
      .pipe(map((data) => data));
  }

  sendWriteUs(data) {
    return this.http
      .post(
        `${environment.writeUsAPIUrl}/send-email`,
        data,
        {
          headers: new HttpHeaders({
          }),
        }
      )
      .pipe(map((data) => data));
  }

  getPokerBanner() {
    return this.http
      .get(`${environment.apiUrl}/appearance/poker-images`, this.httpOptions)
      .pipe(map((data) => data));
  }

  getPokerUrl() {
    return this.http
      .get(`${environment.apiUrl}/appearance/poker-url`, this.httpOptions)
      .pipe(map((data) => data));
  }

  getActiveAPK() {
    return this.http
      .get(`${environment.apiUrl}/applications/active`, this.httpOptions)
      .pipe(map((data) => data));
  }

  getSlides(_type) {
    return this.http
      .get(
        `${environment.apiUrl}/appearance/get-active-carousel/${_type}`,
        this.httpOptions
      )
      .pipe(map((data) => data));
  }

  getTexts() {
    return this.http
      .get(`${environment.apiUrl}/parameterize/text`, this.httpOptions)
      .pipe(map((data) => data));
  }

  getAssets() {
    return this.http
      .get(`${environment.apiUrl}/assets/get-all`, this.httpOptions)
      .pipe(map((data) => data));
  }

  getPDFs() {
    return this.http
      .get(`${environment.apiUrl}/files/get-all/1000/0`, this.httpOptions)
      .pipe(map((data) => data));
  }

  getLocalTexts() {
    return this.http
      .get(`/i18n/es.json`, this.httpOptions)
      .pipe(map((data) => data));
  }

  getTerms() {
    return this.http
      .get(`${environment.apiUrl}/terms/get-feature`, this.httpOptions)
      .pipe(map((data) => data));
  }

  getBalance() {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/balance`)
      .pipe(map((data) => data));
  }

  async getInter() {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.i18n}?time=${new Date().getTime()}`, {
          observe: "response",
          headers: new HttpHeaders({
            "Content-Type": "application/json; charset=utf-8",
          }),
        })
        .pipe(
          (data) => data,
          (err) => err
        )
        .subscribe(
          (res) => {
            resolve(res.body);
          },
          (err) => reject(err)
        );
    });
  }
}

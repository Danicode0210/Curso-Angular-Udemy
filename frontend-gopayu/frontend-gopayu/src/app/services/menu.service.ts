import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";

import { ConfigService } from "./config.service";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private moment = require("moment");
  private uuidv1 = require("uuid");

  // /* Define variables */
  constructor(private http: HttpClient, private config: ConfigService) {}

  getPayUParams(_val, _email) {
    var dataSend = {
      paymentChannelCode: "PayU",
      totalDepositAmount: _val, //this.depositVal.replace(/,/g , ""),
      externalUID: this.uuidv1(),
      promotionalCode: "",
      payUDepositParameter: {
        email: _email,
        successUrl: "https://betplay.com.co/",
      },
    };

    return this.http
      .post(
        `${environment.apiOperator}/accounts/me/deposits`,
        JSON.stringify(dataSend)
      )
      .pipe(map((data) => data));
  }
  getCurrentSessionLimits()
  {
    return this.http.get(`${environment.apiOperator}/accounts/me/session-limits/current`)
    .pipe( map( data => data )
    );
  }
  validaPin() {
    return this.http
      .get(`${environment.validaPin}/valida-retiro`)
      .pipe(map((data) => data));
  }

  createSessionPoker(data) {
    return this.http
      .post(
        `${environment.apiOperator}/esa/getSessionToken`,
        JSON.stringify(data)
      )
      .pipe(map((data) => data));
  }

  validateUserPoker(data) {
    return this.http
      .post(`${environment.apiOperator}/esa/GetUserInfo`, JSON.stringify(data))
      .pipe(map((data) => data));
  }

  getMoneyPoker(data) {
    return this.http
      .post(
        `${environment.apiOperator}/esa/UserTransaction/amount/getFromPoker`,
        JSON.stringify(data)
      )
      .pipe(map((data) => data));
  }
  sendMoneyPoker(data) {
    return this.http
      .post(
        `${environment.apiOperator}/esa/UserTransaction/amount/sendToPoker`,
        JSON.stringify(data)
      )
      .pipe(map((data) => data));
  }
  getBonuses() {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/bonuses`)
      .pipe(map((data) => data));
  }
  getBalance() {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/balance`)
      .pipe(map((data) => data));
  }
  getYearlyTransactions(_year) {
    return this.http
      .get(
        `${environment.apiOperator}/accounts/me/transactions/yearly/${_year}`
      )
      .pipe(map((data) => data));
  }

  getTransactions(type, transactionTypeG, mdate, gt, pageSize, txCurrentPageG) {
    return this.http
      .get(
        `${environment.apiOperator}/accounts/me/transactions?${type}transactionType=${transactionTypeG}${mdate}${gt}&pageSize=${pageSize}&page=${txCurrentPageG}`
      )
      .pipe(map((data) => data));
  }

  getDocuments() {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/personal-documents`)
      .pipe(map((data) => data));
  }
  getTerms() {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/terms?sort=ASC`)
      .pipe(map((data) => data));
  }
  getCurrentLimits()
  {
    return this.http.get(`${environment.apiOperator}/accounts/me/auto-limits/current?limitType=Deposits`)
    .pipe( map( data => data )
    );
  }
  getSessionLimits() {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/session-limits`)
      .pipe(map((data) => data));
  }
  getExclusions() {
    return this.http
      .get(`${environment.apiOperator}/accounts/me/self-exclusions`)
      .pipe(map((data) => data));
  }
  validateCupon(_data: Object) {
    return this.http
      .post(`${environment.cuponURL}/valida-bono`, JSON.stringify(_data))
      .pipe(map((data) => data));
  }
  pinwithdraw(_val, document) {
    var dataSend = {
      docNumber: document,
      amount: _val,
      timeStamp: this.moment(new Date()).toISOString(),
      requestIp: "",
      externalUID: this.uuidv1(),
    };

    // var dataSend = {
    //   "docNumber":  "5555555003",
    //   "amount": 2000,
    //   "timeStamp": this.moment(new Date()).toISOString(),
    //   "requestIp": "190.146.250.228",
    //   "externalUID": this.uuidv1()
    // };
    return this.http
      .post(`${environment.apiPin}`, JSON.stringify(dataSend))
      .pipe(map((data) => data));
  }
  changePassword(_currentPassword, _password) {
    var dataSend = {
      currentPassword: _currentPassword,
      newPassword: _password,
    };

    return this.http
      .post(
        `${environment.apiOperator}/accounts/me/password`,
        JSON.stringify(dataSend),
        {responseType: 'text'}
      )
      .pipe(map((data) => data));
  }
  uploadDocument(_file, _fileName, _date) {
    var dataSend = {
      fileName: _fileName,
      fileContent: _file,
      expirationDate: _date,
    };

    return this.http
      .post(
        `${environment.apiOperator}/accounts/me/personal-documents`,
        JSON.stringify(dataSend)
      )
      .pipe(map((data) => data));
  }
  makeExclusion(_duration) {
    var dataSend = {
      endDate: this.moment().add(_duration, "hours").toISOString(),
    };

    return this.http
      .post(
        `${environment.apiOperator}/accounts/me/self-exclusions`,
        JSON.stringify(dataSend)
      )
      .pipe(map((data) => data));
  }
  setSessionLimit(_duration) {
    var dataSend = {
      duration: _duration,
    };

    return this.http
      .post(
        `${environment.apiOperator}/accounts/me/session-limits`,
        JSON.stringify(dataSend)
      )
      .pipe(map((data) => data));
  }
  getMinVal() {
    return this.http.get(`${environment.i18n}`).pipe(map((data) => data));
  }
  updateAutolimits(limitWeek, limitDay, limitMonth) {
    let weeklyLimit = null;
    let monthlyLimit = null;
    let daylyLimit = null;
    const limits = new Array();
    if (limitWeek !== null) {
      weeklyLimit = {
        quantity: parseInt(limitWeek),
        duration: {
          periodUnity: "Week",
          periodValue: 84,
        },
      };
      limits.push(weeklyLimit);
    }

    if (limitMonth !== null) {
      monthlyLimit = {
        quantity: parseInt(limitMonth),
        duration: {
          periodUnity: "Month",
          periodValue: 83,
        }
      };
      limits.push(monthlyLimit);
    }

    if (limitDay !== null) {
      daylyLimit = {
        quantity: parseInt(limitDay),
        duration: {
          periodUnity: "Day",
          periodValue: 82,
        },
      };
      limits.push(daylyLimit);
    }
    var dataSend = {
      limitType: 78,
      limits: limits,
      limitQuestions: [
        {
          question: "perro",
          answer: true,
        },
      ],
    };

    return this.http
      .post(
        `${environment.apiOperator}/accounts/me/auto-limits`,
        JSON.stringify(dataSend)
      )
      .pipe(map((data) => data));
  }

  
  acceptOrRefuseAutolimits(limits, acceptedLimits) {
    const newLimits = [];
    limits.forEach(element => {
      let periodValue = 0;
      let periodUnity = '';

      if (element.tiempoLimite === 'MENSUAL') {
        periodValue = 83;
        periodUnity = 'Month';
      } else if (element.tiempoLimite === 'SEMANAL') {
        periodValue = 84;
        periodUnity = 'Week';
      } else if (element.tiempoLimite === 'DIARIO') {
        periodValue = 82;
        periodUnity = 'Day';
      }

      const limit = {
        quantity: parseInt(element.valorSolicitud),
        duration: {
          periodUnity: periodUnity,
          periodValue: periodValue,
          requestId: element.idSolicitud
        }
      };

      newLimits.push(limit);
    });
    var dataSend = {
      limitType: 78,
      acceptedLimits: acceptedLimits,
      limits: newLimits
    };
    return this.http
      .post(
        `${environment.apiOperator}/accounts/me/auto-limits/update`,
        JSON.stringify(dataSend)
      )
      .pipe(map((data) => data));
  }
}

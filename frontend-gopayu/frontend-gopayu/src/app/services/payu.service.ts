import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Md5 } from 'md5-typescript';

@Injectable({
  providedIn: 'root'
})
export class PayuService {
  public uuidv1 = require('uuid');
  public token = JSON.parse(localStorage.getItem('session'));
  public userdata = JSON.parse(localStorage.getItem('profile'));
  public fullname: any = `${this.userdata.firstName} ${this.userdata.firstName2} ${this.userdata.lastName} ${this.userdata.lastName2}`;
  public fullNameCard: any = `${this.userdata.firstName} ${this.userdata.lastName}`;
  public cookie =  Md5.init(this.uuidv1.v1());
  public luhn = require('luhn');
  constructor(private http: HttpClient) {
    const uuidv1 = this.uuidv1;
    localStorage.setItem('referenceCodePse', JSON.stringify(uuidv1.v1()));

  }

  /* Obtener la Ip del cliente  */

  getIPAddress() {
    return this.http.get(`${environment.ip}`);
  }


  /* Obtener metodos de pago*/

  /*   Método POST  de Pago con TC */
  postPayuCard(paymentMethod, numberCard, securityCode, installmentsCard,
    creditCardExpirationDateMes, creditCardExpirationDateAno, deviceSessionId,userAgent) {
    const dataSend = {
      totalDepositAmount: localStorage.getItem('valoraRecargar'),
      externalUID: JSON.parse(localStorage.getItem('referenceCode')),
      paymentMethod:(paymentMethod),
      payerName: this.fullname.toString(),
      payerDniType: this.userdata.identityDocument.type.replace('.', ''),
      payerDni: this.userdata.identityDocument.number.toString(),
      payerEmail: this.userdata.email,
      payerPhone: this.userdata.mobile.toString(),
      payerStreet: this.userdata.residence.address,
      payerCity:  this.userdata.residence.cityText ,
      payerState: this.userdata.residence.regionText,
      payerCountry:this.userdata.residence.countryCode,
      creditCardNumber: numberCard.replace(/ /g, ''),
      creditCardSecurityCode: securityCode,
      creditCardExpirationDate: `${20 + creditCardExpirationDateAno}/${creditCardExpirationDateMes}`.toString(),
      creditCardCardholder: this.fullNameCard,
      installments: installmentsCard,
      deviceSessionId: (deviceSessionId),
      ipAddress: JSON.parse(localStorage.getItem('Ip')),
      cookie: this.cookie.replace('-', ''),
      userAgent: (userAgent)
    };
    return this.http
      .post(
        `${environment.apiPayUNew}/accounts/me/deposits`,
        JSON.stringify(dataSend), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: this.token.accessToken,
        })
      }
      )
      .pipe(map((data) => (data)),
        catchError(err => {
          console.warn(err);
          return throwError('Ha ocurrido un error');
        }));
  }




  /*  Método POST de pago con Pse*/
  postPayuPse(codeBank) {
    const dataSend = {
      totalDepositAmount: localStorage.getItem('valoraRecargar'),
      externalUID: JSON.parse(localStorage.getItem('referenceCode')),
      paymentMethod: 'PSE',
      payerName: this.fullname,
      payerEmail:this.userdata.email,
      payerType: 'N',
      payerDniType: this.userdata.identityDocument.type.replace('.', ''),
      payerDni: this.userdata.identityDocument.number,
      payerPhone: this.userdata.mobile.toString(),
      payerStreet: this.userdata.residence.address,
      payerCity:  this.userdata.residence.cityText ,
      payerState: this.userdata.residence.regionText,
      payerCountry:this.userdata.residence.countryCode,
      codeBank: (codeBank),
      ipAddress: JSON.parse(localStorage.getItem('Ip')),
    };
    return this.http
      .post(
        `${environment.apiPayUNew}/accounts/me/deposits`,
        JSON.stringify(dataSend), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: this.token.accessToken,
        })
      }
      )
      .pipe(map((data) => (data)),
        catchError(err => {
          console.warn(err);
          return throwError('Ha ocurrido un error');
        }));
  }


  /*  Reintentar transacción  con Pse*/

  postPayuPseReintentarTransaccion(codeBank: any) {
    const dataSend = {
      totalDepositAmount: localStorage.getItem('valoraRecargar'),
      externalUID: JSON.parse(localStorage.getItem('referenceCodePse')),
      paymentMethod: 'PSE',
      payerName: this.fullname,
      payerType: 'N',
      payerDniType: this.userdata.identityDocument.type.replace('.', ''),
      payerDni: this.userdata.identityDocument.number,
      payerPhone: this.userdata.mobile.toString(),
      codeBank: (codeBank),
      ipAddress: JSON.parse(localStorage.getItem('Ip')),
    };
    return this.http
      .post(
        `${environment.apiPayUNew}/accounts/me/deposits`,
        JSON.stringify(dataSend), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: this.token.accessToken,
        })
      }
      )
      .pipe(map((data) => (data)),
        catchError(err => {
          console.warn(err);
          return throwError('Ha ocurrido un error');
        }));
  }


  /* Método de pago con Baloto */
  postPayuBaloto() {
    const dataSend = {
      totalDepositAmount: localStorage.getItem('valoraRecargar') ,
      externalUID: JSON.parse(localStorage.getItem('referenceCode')) ,
      paymentMethod: 'BALOTO',
      ipAddress: JSON.parse(localStorage.getItem('Ip'))
    };
    return this.http
      .post(
        `${environment.apiPayUNew}/accounts/me/deposits`,
        JSON.stringify(dataSend), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: this.token.accessToken,
        })
      }
      )
      .pipe(map((data) => (data)),
        catchError(err => {
          console.warn(err);
          return throwError('Ha ocurrido un error');
        }))
  }
}


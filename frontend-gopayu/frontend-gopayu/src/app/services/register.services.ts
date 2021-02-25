import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map  } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

    // /* Define variables */
    constructor(private http:HttpClient, private config:ConfigService) { }

    compliance(_data)
    {
        return this.http.post(`${environment.apiCompliance}`, _data, {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Basic YXJxdWl0ZWN0b3RpQGNlbWNvbG9tYmlhLmNvOkdGSE9PRVpZ'
            })
        })
        .pipe(
                res => {
                    return res;
                }
        );
    }
    registerPlayer(_data)
    {
        return this.http.post(`${environment.apiOperator}/accounts`, JSON.stringify(_data))
        .pipe( map( data => data )
        );
    }

    verifyPhone(data: any): Observable<any> {
        return this.http.post('http://localhost:3001/verification', data);
    }

    sendSMS(data: any): Observable<any> {
        return this.http.post('http://localhost:3001/phoneAuth', data);
    }

    deleteCode(data: any): Observable<any> {
        return this.http.post('http://localhost:3001/deleteCode', data);
    }
    playerActualization(_data): Observable<any> {
        return this.http.post(`${environment.apiOperator}/accounts/data-actualization`, JSON.stringify(_data))
        .pipe( map( data => data )
        );
    }
}

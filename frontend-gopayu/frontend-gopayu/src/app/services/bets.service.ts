import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map  } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BetsService {

    // /* Define variables */
    constructor(private http:HttpClient, private config:ConfigService) { }
    getKambiToken()
    {
        var dataSend = {
            "integrationChannelCode": "KAMBI",
            "gameCode": "KAMBI",
            "flashClient": false
        };

        return this.http.post(`${environment.apiOperator}/games/kambi/authenticate-wallet`, JSON.stringify(dataSend))
        .pipe( map( data => data )
        );
    }

}

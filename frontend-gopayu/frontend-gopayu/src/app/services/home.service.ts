import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map  } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

    // /* Define variables */
    constructor(private http:HttpClient, private config:ConfigService) { }

    /* Define variables */
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8'
        })
    };

    getBanner()
    {
        return this.http.get(`${environment.apiUrl}/layouts/get-feature`, this.httpOptions)
        .pipe( map( data => data ) 
        );
    }
    getHomeImages()
    {
        return this.http.get(`${environment.apiUrl}/appearance/home-images`, this.httpOptions)
        .pipe( map( data => data ) 
        );
    }

}

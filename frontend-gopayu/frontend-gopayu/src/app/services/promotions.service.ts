import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

    /* Define variables */
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    };

    constructor(private http:HttpClient) { }

    getPromotionsBanner()
    {   
        return this.http.get(`${environment.apiUrl}/promociones/banners/get-banners`, this.httpOptions)
        .pipe( map( data => data ) 
        );
    }

    getPromotions()
    {
        return this.http.get(`${environment.apiUrl}/promotions/categories`, this.httpOptions)
        .pipe( map( data => data ) 
        );
    }

    getPromotionsDetail(_id)
    {
        return this.http.get(`${environment.apiUrl}/promociones/get-single-promo/${_id}`, this.httpOptions)
        .pipe( map( data => data ) 
        );
    }

    

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map  } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SlotsService {

    /* Define variables */
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    };

    constructor(private http:HttpClient) { }

    getSlotsBanner()
    {
        return this.http.get(`${environment.apiUrl}/slots/get-banner`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    
    searchSlots(_criteria)
    {
      return this.http.get(`${environment.apiUrl}/slots/get-all/5/0?criteria=${_criteria}`, this.httpOptions)
        .pipe( map( data => data )
        );
    }

    getSlots()
    {
        return this.http.get(`${environment.apiUrl}/slots/get-all/1000/0`, this.httpOptions)
        .pipe( map( data => data )
        );
    }

    launchGame(_data)
    {
        return this.http.post(`${environment.apiOperator}/accounts/me/game-launch-url`, JSON.stringify(_data), this.httpOptions)
        .pipe( map( data => data )
        );
    }

    getCategories()
    {
      return this.http.get(`${environment.apiUrl}/slots/categories/sisplay`, this.httpOptions)
        .pipe( map( data => data )
        );
    }

    getSlotsByCategoryId(_id)
    {
      return this.http.get(`${environment.apiUrl}/slots/category/${_id}/all`, this.httpOptions)
        .pipe( map( data => data )
        );
    }

    getPaginatedSlots(id, start, skip)
    {
      return this.http.get(`${environment.apiUrl}/slots/categories/${id}/${start}/${skip}/sisplay`, this.httpOptions)
      .pipe( map( data => data )
      );
    }
}

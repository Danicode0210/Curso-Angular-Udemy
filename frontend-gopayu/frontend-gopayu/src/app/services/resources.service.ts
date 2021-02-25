import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

    /* Define variables */
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    };

    constructor(private http:HttpClient) { }

    getGenders()
    {   
        return this.http.get(`${environment.apiResources}/resources/genders`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getDocumentTypes()
    {   
        return this.http.get(`${environment.apiResources}/resources/document_types`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getCities(_bornDepartment)
    {   
        return this.http.get(`${environment.apiResources}/resources/cities?regionCode=${_bornDepartment}`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getCitiesAndDepartments() 
    {
        return this.http.get(`${environment.apiResources}/resources/cities_departments`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getRegions(_country)
    {   
        return this.http.get(`${environment.apiResources}/resources/regions?countryCode=${_country}`, this.httpOptions)
        .pipe( map( data => data )
        );
    }
    getCountries()
    {   
        return this.http.get(`${environment.apiResources}/resources/countries`, this.httpOptions)
        .pipe( map( data => data )
        );
    }

    validatePhoneNumber(data)
    {
      return this.http.post(`${environment.cuponURL}/valida-phone-number`, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
        }),
        observe: 'response'
      })
      .pipe( map( data => data )
      );
    }


}

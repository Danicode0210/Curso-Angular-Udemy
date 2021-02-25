import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataPopupService {

    // /* Define variables */
    constructor(private http:HttpClient) { }

    sendData(_data, _file, _file2)
    {
        _data.docNumber = parseInt(_data.docNumber);
        _data.procedinero = 1;

        var dataSend = new FormData();
        for(let index in _data)
        {
            dataSend.append(index, _data[index]); 
        }
        dataSend.append('foto', _file, _file.name);
        dataSend.append('foto2', _file2, _file2.name);

        return this.http.post(`${environment.dataUrl}/fnt/datos-mayor`, dataSend)
        .pipe( map( data => data )
        );
    }

}

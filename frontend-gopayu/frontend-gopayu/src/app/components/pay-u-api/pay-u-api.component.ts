import { Component, OnInit, Input } from '@angular/core';
import { PayuService } from '../../services/payu.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pay-u-api',
  templateUrl: './pay-u-api.component.html',
  styleUrls: ['./pay-u-api.component.styl'],
})
export class PayUApiComponent implements OnInit {
  public ipAddress: string;
  public paymentmethods: any;
  public banks: any[] = [];

  @Input() userdata = JSON.parse(localStorage.getItem('profile'));

  @Input() dataSend = JSON.parse(localStorage.getItem('referenceCode'));

  @Input() valor = JSON.parse(localStorage.getItem('valoraRecargar'));

  constructor(private payuService: PayuService, private http: HttpClient) {

    if (localStorage.getItem('banks') === null) {
     this.http
        .get(`${environment.apiPayUNew}/accounts/me/bankslist`)
        .subscribe((res: any) => {
          res;
          JSON.stringify(localStorage.setItem('banks', JSON.stringify(res)));
        });
    } else {
      setInterval(() => {
        this.http
          .get(`${environment.apiPayUNew}/accounts/me/bankslist`)
          .subscribe((res: any) => {
            res;
            JSON.stringify(localStorage.setItem('banks', JSON.stringify(res)));
          });
      }, 84600000);
    }
  }

  ngOnInit() {
    this.getIP();
  }

  getIP() {
    this.payuService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      localStorage.setItem('Ip', JSON.stringify(res));
    });
  }
}

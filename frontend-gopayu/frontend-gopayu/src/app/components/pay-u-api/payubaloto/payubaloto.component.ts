import { Component, OnInit, Sanitizer, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { PayuService } from '../../../services/payu.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-payubaloto',
  templateUrl: './payubaloto.component.html',
  styleUrls: ['./payubaloto.component.styl']
})
export class PayubalotoComponent implements OnInit {

  @Input() dataSend = JSON.parse(localStorage.getItem('referenceCode'));
  @Input() valor = JSON.parse(localStorage.getItem('valoraRecargar'));

  public ipAddress: string;
  public dataBaloto: any;
  public dataBalotoRedireccion: any;
  public idBotonBaloto = document.getElementById('generarNumeroDePago')
  public forma: FormGroup;
  public formError: string = '';
  public msgError;
  public isLoading: boolean = false;
  public moment = require('moment');
  public fechaTransaccion: any = localStorage.setItem('fecha', this.moment(new Date()).toISOString());
  public referenciaDePago;
  public declined = '';
  public declinedMedioDePago = '';
  public uuidv1 = require('uuid');

  constructor(private payuService: PayuService, private fb: FormBuilder, private store: Store<AppState>, private sanitizer: DomSanitizer) {
    this.forma = this.fb.group({
      acceptsTerms: new FormControl('', [Validators.required])
    });


  }

  ngOnInit() {
  }


  postPayuBaloto() {
    if (!this.forma.value.acceptsTerms) {
      this.msgError = 'Debes aceptar los términos y condiciones de la compra para poder realizar tu pago'
    } else {

      this.payuService.postPayuBaloto()
        .subscribe((res: any) => {
          this.fechaTransaccion = localStorage.getItem('fecha');
          this.referenciaDePago = res.orderId;
          /*    this.isLoading = false; */
          this.dataBaloto = this.sanitizer.bypassSecurityTrustResourceUrl(res.extraParameters.URL_PAYMENT_RECEIPT_HTML);

          this.declinedMedioDePago = res.state;
          this.declined = res.state;
          if (res.state === 'DECLINED') {
            this.declined = 'declinado';
          } else {
            this.declined;
          }
        }

          /* this.isLoading = true;
          setTimeout(() => {
              form.submit();
          }, 1000); */
        );
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { PayuService } from '../../../services/payu.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-payu-pse',
  templateUrl: './payu-pse.component.html',
  styleUrls: ['./payu-pse.component.styl']
})
export class PayuPSEComponent implements OnInit {

  @Input() userdata = JSON.parse(localStorage.getItem('profile'));

  @Input() dataSend = JSON.parse(localStorage.getItem('referenceCode'));

  @Input() valor = JSON.parse(localStorage.getItem('valoraRecargar'));

  @Input() balance = JSON.parse(localStorage.getItem('balance'));

  @Input() banks = JSON.parse(localStorage.getItem('banks'));


  public ipAddress: string;
  public forma: FormGroup;
  public fullname: any = ` ${this.userdata.firstName} ${this.userdata.firstName2} ${this.userdata.lastName} ${this.userdata.lastName2}`;
  public optionSeleccionadoTypePerson;
  public optionSeleccionadoBank;
  public typePerson = 'Natural';
  public msgError;
  public msgErrorBanco;
  public dataPse;
  public empresa = 'Corredor Empresarial S.A';
  public nit = '900243000-8';
  public referenciaDePedido;
  public referenciaTransaccion;
  public numeroTransaccion;
  public pseBank;
  public valorRecarga;
  public moneda;
  public descripcion;
  public ipOrigen;
  public polResponseCode;
  public polTransactionState;
  public referencePol;
  public total;
  public dateDay = Date.now();
  public uuidv1 = require('uuid')
  public moment = require('moment');
  public fechaTransaccion: any = localStorage.setItem('fecha', this.moment(new Date()).toISOString());
  public referenciaDePago = '';
  public declined = '';
  public declinedMedioDePago = ''


  constructor(private payuService: PayuService, private http: HttpClient, private fb: FormBuilder, private activatedRoute: ActivatedRoute) {

    this.forma = this.fb.group({
      bank: new FormControl(['', Validators.required]),
      name: this.fullname,
      typePerson: this.typePerson,
      typeDocument: this.userdata.identityDocument.type,
      document: this.userdata.identityDocument.number,
      mobile: this.userdata.mobile,
      acceptsTerms: new FormControl('', [Validators.required])

    });

  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {

      this.referenciaDePedido = params[`referenceCode`];
      this.referenciaTransaccion = params[`transactionId`];
      this.numeroTransaccion = params[`cus`];
      this.pseBank = params[`pseBank`];
      this.valorRecarga = params[`TX_VALUE`];
      this.moneda = params[`currency`];
      this.descripcion = params[`description`];
      this.ipOrigen = params[`pseReference1`];
      this.polTransactionState = params[`polTransactionState`];
      this.polResponseCode = params[`polResponseCode`];
      this.referencePol = params[`reference_pol`]

      if (this.polTransactionState == 4 && this.polResponseCode == 1) {
        this.polResponseCode = 'Transacción aprobada';
        document.getElementById('logoAprobado').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/aprobado.png';
        document.getElementById('logoAprobado').appendChild(img);

      }
      if (this.polTransactionState == 6 && this.polResponseCode == 5) {
        this.polResponseCode = 'Transacción fallida';
        document.getElementById('logoRechazado').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/logo-rechazado.png';
        document.getElementById('logoRechazado').appendChild(img);
      }

      if (this.polTransactionState == 6 && this.polResponseCode == 4) {

        this.polResponseCode = 'Transacción rechazada';
        document.getElementById('logoRechazado').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/logo-rechazado.png';
        document.getElementById('logoRechazado').appendChild(img);
      }
      if (this.polTransactionState == 6 && this.polResponseCode == 19) {

        this.polResponseCode = 'Transacción rechazada';
        document.getElementById('logoRechazado').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/logo-rechazado.png';
        document.getElementById('logoRechazado').appendChild(img);
      }
      if (this.polTransactionState == 12 && this.polResponseCode == 9994) {

        this.polResponseCode = 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco. ';
        document.getElementById('logoAdmiracion').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/signoAdmiracionCard.png';
        document.getElementById('logoAdmiracion').appendChild(img);
      }
      if (this.polTransactionState == 12 && this.polResponseCode == 25) {

        this.polResponseCode = 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco. ';
        document.getElementById('logoAdmiracion').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/signoAdmiracionCard.png';
        document.getElementById('logoAdmiracion').appendChild(img);
      }
      if (this.polTransactionState == 14 && this.polResponseCode == 25) {

        this.polResponseCode = 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco. ';
        document.getElementById('logoAdmiracion').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/signoAdmiracionCard.png';
        document.getElementById('logoAdmiracion').appendChild(img);
      }
      if (this.polTransactionState == 14 && this.polResponseCode == 9994) {

        this.polResponseCode = 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco. ';
        document.getElementById('logoAdmiracion').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/signoAdmiracionCard.png';
        document.getElementById('logoAdmiracion').appendChild(img);
      }
      if (this.polTransactionState == 6 && this.polResponseCode == 14) {

        this.polResponseCode = 'Transacción pendiente, por favor revisar si el débito fue realizado en el banco. ';
        document.getElementById('logoAdmiracion').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/signoAdmiracionCard.png';
        document.getElementById('logoAdmiracion').appendChild(img);
      }
    });
    if (this.polResponseCode == 'Transacción aprobada') {

      this.total = this.balance.totalBalance + this.valor;
    } else {
      this.total = 0;
    }
    localStorage.setItem('balancePse', this.total);
  }


  postPayuPse() {


    if (!this.forma.value.acceptsTerms) {
      this.msgError = 'Debes aceptar los términos y condiciones de la compra para poder realizar tu pago'
    } else {
      this.payuService.postPayuPse(this.forma.value.bank)
        .subscribe((res: any) => {
          console.log(res)
          this.declinedMedioDePago = res.state;
          this.declined = res.state;
          this.referenciaDePago = res.orderId;
          this.fechaTransaccion = localStorage.getItem('fecha');
          if (res.state === 'DECLINED') {
            this.declined = 'declinado';
          }


          this.dataPse = window.location.href = res.extraParameters.BANK_URL;
        }
        )
    };
    localStorage.setItem('codeBank', this.forma.value.bank);
  }



  /* Boton reintentar transacción */
  postPayuPseReintentar() {
    this.dataPse = window.location.href = '/payU/pse';
    const uuidv1 = this.uuidv1;
    localStorage.setItem('referenceCode', JSON.stringify(uuidv1.v1()));
  }


  guardar(param) {
    console.log(this.forma);
  }

  buttonPrint() {
    window.print();

  }

}

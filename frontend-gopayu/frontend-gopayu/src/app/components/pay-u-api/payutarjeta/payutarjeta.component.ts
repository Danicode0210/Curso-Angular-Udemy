import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'md5-typescript';
import { PayuService } from '../../../services/payu.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-payutarjeta',
  templateUrl: './payutarjeta.component.html',
  styleUrls: ['./payutarjeta.component.styl']
})
export class PayutarjetaComponent implements OnInit {
  @Input() userdata = JSON.parse(localStorage.getItem('profile'));

  @Input() dataSend = JSON.parse(localStorage.getItem('referenceCode'));

  @Input() valor = JSON.parse(localStorage.getItem('valoraRecargar'));

  public uuidv1 = require('uuid');
  public numberTarjeta;
  public numberTarjetaMaskify;
  public cvvMaskify;
  public numberCodigoSeguridad: string;
  public fechaDeVencimiento;
  public fechaDeVencimientoAno;
  public fechaDeVencimientoMes;
  public fechaTransaccion;
  public forma: FormGroup;
  public placeholder = ' 4000 1234 5678 9010';
  public placeHolderCardNumber: string = ' 1234 5678 9000 0000';
  public logoVisaTwo = document.querySelector('#logoVisa');
  public meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public anos = ['21', '22', '23', '24',
    '25', '26', '27', '28', '29', '30', '31',
    '32', '33', '34', '35', '36', '37', '38', '38', '40', '41'];
  public cuotas = [
    '1', '2', '3', '4', '5', '6', '7'
    , '8', '9', '10', '11', '12', '13',
    '14', '15', '16', '17', '18', '18',
    '19', '20', '21', '22', '23', '24',
    '25', '26', '27', '28', '29', '30', '31',
    '32', '33', '34', '35', '36'
  ];
  public fullname: any = `${this.userdata.firstName} ${this.userdata.firstName2} ${this.userdata.lastName} ${this.userdata.lastName2}`;
  public fullNameCard: any = `${this.userdata.firstName}  ${this.userdata.lastName} `;
  public dataCard;
  public displayNone;
  public msgError;
  public msgErrorLuhn;
  public num;
  public deviceSessionId = Md5.init(this.uuidv1.v1());
  public logoVisa = document.getElementById('logoVisa');
  public reemplazoTarjeta = document.getElementById('labelTarjeta');
  public responseDataCard;
  public resDataCard;
  public paymentMethod;
  public userAgent = navigator.userAgent;


  constructor(private fb: FormBuilder, private payuService: PayuService, private http: HttpClient) {

    this.forma = this.fb.group({
      paymentMethod: new FormControl(['', [Validators.required]]),
      numeroDeTarjeta: new FormControl(['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]]),
      codigoDeSeguridad: new FormControl('', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]),
      fechaDeVencimientoMes: new FormControl(['', Validators.required]),
      fechaDeVencimientoAno: new FormControl(['', Validators.required]),
      cuotas: new FormControl(['', Validators.required]),
      acceptsTerms: new FormControl('', [Validators.required])
    });



  }

  ngOnInit() {

  }



  numberFormatCard(field) {
    this.num = this.forma.value[field].replace(/\s/g, '').replace(/\D/g);
    this.numberTarjetaMaskify = this.num;
    if (!isNaN(this.num)) {
      const luhn = require('luhn');
      const isValid = luhn.validate(this.num);
      if (isValid === false) {
        this.msgErrorLuhn = 'Número de tarjeta de crédito inválido';
      } else {
        this.msgErrorLuhn = '';
      }
      const TClength = this.num.length;
      for (let i = 0; i < TClength - 15; i++) {
        this.num = this.num.replace(/.(?=.{4})/g, '*');
      }
      this.num = this.num.toString().replace(/(?=\d*\.?)(\d{4})/g, '$1 ').trim();
      document.getElementById('labelTarjeta').textContent = this.num;
      document.getElementById('logoVisa').innerHTML = '';
      document.getElementById('logoMastercard').innerHTML = '';
      this.forma.patchValue({
        [field]: this.num
      });
      if (this.num[0] == 4) {
        this.paymentMethod = 'VISA';
        document.getElementById('logoVisa').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/logo-visa.png';
        document.getElementById('logoVisa').appendChild(img);
      } else if (this.num[0] == 5) {
        this.paymentMethod = 'MASTERCARD'
        document.getElementById('logoMastercard').innerHTML = '';
        const img = document.createElement('img');
        img.src = 'assets/img/payU/logo-mastercard.png';
        document.getElementById('logoMastercard').appendChild(img);
      }
      if (this.num === '') {
        document.getElementById('labelTarjeta').textContent = '1234 5678 9000 0000';
      }
    } else {
      this.forma.patchValue({
        [field]: this.forma.value[field].replace(/[^\d\.]*/g, ''),
      });
    }
  }

  clicklogoVisa() {
    document.getElementById('logoVisa').innerHTML = '';
    document.getElementById('logoMastercard').innerHTML = '';
    const img = document.createElement('img');
    img.src = 'assets/img/payU/logo-visa.png';
    document.getElementById('logoVisa').appendChild(img);
  }

  clicklogoMastercard() {
    document.getElementById('logoMastercard').innerHTML = '';
    document.getElementById('logoVisa').innerHTML = '';
    const img = document.createElement('img');
    img.src = 'assets/img/payU/logo-mastercard.png';
    document.getElementById('logoMastercard').appendChild(img);
  }

  numberFormatCardCvv(field) {
    this.num = this.forma.value[field].replace(/\s/g, '').replace(/\D/g);
    this.cvvMaskify = this.num;
    if (!isNaN(this.num)) {
      const TClength = this.num.length;
      for (let i = 0; i < TClength - 2; i++) {
        this.num = this.num.replace(/.(?=.{0})/g, '*');
      }
      this.num = this.num.toString().replace(/(?=\d*\.?)(\d{4})/g, '$1 ').trim();
      this.forma.patchValue({
        [field]: this.num
      });
    } else {
      this.forma.patchValue({
        [field]: this.forma.value[field].replace(/[^\d\.]*/g, ''),
      });
    }
  }

  postPayuCard() {
    if (!this.forma.value.acceptsTerms) {
      this.msgError = 'Debes aceptar los términos y condiciones de la compra para poder realizar tu pago';
    } else {
    this.payuService.postPayuCard(this.paymentMethod, this.numberTarjetaMaskify, this.cvvMaskify,
      this.forma.value.cuotas.toString(), this.forma.value.fechaDeVencimientoMes,
      this.forma.value.fechaDeVencimientoAno, this.deviceSessionId, this.userAgent)
      .subscribe((res: any) => {
        this.dataCard = res.orderId;
        if (!this.forma.value.acceptsTerms) {
          this.msgError = 'Debes aceptar los términos y condiciones de la compra para poder realizar tu pago';
        }
        if (res.state === 'APPROVED') {
          this.responseDataCard = 'aprobada';
          document.getElementById('logoAprobado').innerHTML = '';
          const img = document.createElement('img');
          img.src = 'assets/img/payU/aprobado.png';
          document.getElementById('logoAprobado').appendChild(img);
          this.resDataCard = res.state;

        }
        if (res.state === 'DECLINED') {
          this.responseDataCard = 'declinada';
          document.getElementById('logoRechazado').innerHTML = '';
          const img = document.createElement('img');
          img.src = 'assets/img/payU/logo-rechazado.png';
          document.getElementById('logoRechazado').appendChild(img);
          this.resDataCard = res.state;
        }
        if (res.state === 'PENDING') {
          this.responseDataCard = 'pendiente';
        }
        const moment = require('moment');
        this.fechaTransaccion = localStorage.setItem('fecha', moment(new Date()).toISOString());
        this.fechaTransaccion = localStorage.getItem('fecha');
        return console.log(res);
      });
  }};


  /*  enviar datos del form  */

  onSubmit() {
  }



}








import { MatDialogRef } from '@angular/material';
import { AppState } from './../../../../app.state';
import { MenuService } from './../../../../services/menu.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-menu-deposits',
  templateUrl: './menu-deposits.component.html',
  styleUrls: ['./menu-deposits.component.styl']
})
export class MenuDepositsComponent implements OnInit {

  @Input() valoraRecargar: any;
  public uuidv1 = require('uuid');
  public ngIf: any = '';
  public methodId: number = 1;
  public formData: FormGroup;
  public isLoading: boolean = false;
  public URLPayU: string = "";
  public formError = '';
  public minVal: any = 10000;
  public activedBonuses: boolean = false;
  public textDropDownRecharge = 'Recargar Punto De Venta';
  public textBotonProceed = 'Proceder';
  public textSelectedMethod = {
    1: 'Recargar Punto De Venta',
    2: 'Recargar Via Baloto',
    3: 'Recarga Con PayU',
    5: 'Redimir Cupon'
  };
  // PayU FormData
  public payuData: any = {
    URLPayU: "",
    merchantId: "",
    accountId: "",
    referenceCode: "",
    amount: "",
    currency: "",
    signature: "",
    algorithmSignature: "",
    tax: "",
    taxReturnBase: "",
    description: "",
    test: "",
    buyerEmail: "",
    buyerFullName: "",
    payerFullName: "",
    payerMobilePhone: "",
    payerDocument: "",
    payerDocumentType: "",
    telephone: "",
    confirmationUrl: "",
    responseUrl: ""
  }
  public assetsSubscription: Subscription;
  /* Get tetxs */
  public texts$;
  public localTexts$;
  public list: string[] = [];
  public value:any;
  constructor(private service: MenuService, private store: Store<AppState>, private dialogRef: MatDialogRef<MenuDepositsComponent>) {



    var profile: any = localStorage.getItem("profile");
    profile = JSON.parse(profile);

    /* Save form */
    this.formData = new FormGroup({
      email: new FormControl(profile.email, [
        Validators.required,
        Validators.email,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]),
      value: new FormControl('', [
        Validators.required
      ])
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnInit() {
    /* Se genera la referencia dinamica */
    const uuidv1 = this.uuidv1;
    localStorage.setItem('referenceCode', JSON.stringify(uuidv1.v1()));

    this.assetsSubscription = this.store.select('assets').subscribe(assets => {
      this.texts$ = assets.texts;
      this.localTexts$ = assets.i18n;
      if (this.localTexts$['Bonuses']) {
        this.activedBonuses = this.localTexts$['Bonuses']['activedBonuses'];
      }
      if (this.localTexts$['PayU']) {
        this.minVal = this.localTexts$['PayU']['minVal'];
      }
    });

  }

  gaEventSelectRechargeMethod(): void {
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Recarga tu cuenta',
      label: this.textSelectedMethod[this.methodId]
    };
    window.dataLayer.push(event);
  }

  gaEventProceedRecharge(): void {
    const rechargeValue = this.formData.controls.value.value.split('.').join('');
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Recarga tu cuenta',
      label: this.textBotonProceed,
      value: rechargeValue,
      metodoRecarga: this.textSelectedMethod[(this.methodId - 1)]
    };

    window.dataLayer.push(event);
    this.value = localStorage.setItem('valoraRecargar', rechargeValue);
    if (event.value >= 10000) {
      window.location.href = '/payU';
    }

  }


  numberFormat(field) {
    var num = this.formData.value[field].replace(/\./g, '');

    if (!isNaN(num)) {
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/, '');
      this.formData.patchValue({
        [field]: num
      });
    }
    else {
      this.formData.patchValue({
        [field]: this.formData.value[field].replace(/[^\d\.]*/g, ''),
      });
    }
  }

  getMinValue() {
    this.gaEventProceedRecharge();
    this.service.getMinVal()
      .subscribe((response: any) => {
        if (response.PayU) {
          this.minVal = response.PayU.minVal;

        }
      })

  }

  getPayUParams() {
    this.gaEventProceedRecharge();
    this.formError = '';
    if (this.formData.status == 'VALID') {
      const val = this.formData.value.value.replace(/\./g, "");

      if ( parseInt(val) < this.minVal) {
        this.formError = 'MinimalDeposit';
      }
      else {
        this.isLoading = true;
        this.service.getPayUParams(val, this.formData.value.email)
          .subscribe((response: any) => {
            this.payuData = response.payUDepositResponse;
            this.URLPayU = response.url;
            var form: any = document.getElementById('payuForm');
            var profile: any = localStorage.getItem('profile');
            profile = JSON.parse(profile);
            this.payuData.buyerEmail = profile.email;
            setTimeout(() => {
              form.submit();
            }, 1000);
          },
            (err: any) => {
              this.isLoading = false;
              if (err.body.errorCode) {
                this.formError = err.body.errorCode;
              }
            }
          );
      }
    }
  }


}

import { AppState } from './../../../../../app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-bonnus',
  templateUrl: './bonnus.component.html',
  styleUrls: ['./bonnus.component.styl']
})
export class BonnusComponent implements OnInit {

  public formData: FormGroup;
  public isLoading: Boolean = false;
  public assets: any;
  public i18n: any;
  public assetsSubscription: Subscription;
  public successMessage:string = "";
  public requestSuccess: Boolean = false;
  public error: String = '';
  public step:number = 0;
  public textBotonRedimirCoupon = 'Redimir Cupon';

  constructor(private service:MenuService, private store:Store<AppState> ) { 
    /* Save form */
    this.formData = new FormGroup({
      cuponCode: new FormControl('', [
        Validators.required
      ])
    });
  }

  ngOnInit() {

    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.assets = assets;
      this.i18n = assets.i18n;

      if(this.i18n.Bonuses && this.i18n.Bonuses.success)
      {
        this.successMessage = this.i18n.Bonuses.success;
      }
    });
  }

  gaEventCoupon(): void {
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Recarga tu cuenta',
      label: this.textBotonRedimirCoupon
    };
    window.dataLayer.push(event);
  }

  gaEventErrorValidateCoupon(error: boolean): void {
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Recarga tu cuenta',
      label : this.textBotonRedimirCoupon + ' - ' + (error === false ? 'Exitoso' : 'Fallido')
    };
    window.dataLayer.push(event);
  }

  validateCupon()
  { 
    this.gaEventCoupon();
    this.error = '';
    if(this.formData.status === 'VALID')
    {
        this.isLoading = true;

        let profile = JSON.parse(localStorage.getItem("profile"));

        let dataSend = {
          "docNumber": profile.identityDocument.number,
          "id_player": profile.accountId,
          "id_bono": this.formData.value['cuponCode'],
          "registerDate": profile.registerDate
        }

        this.service.validateCupon(dataSend)
        .subscribe((response:any) => {
          this.isLoading = false;
          this.requestSuccess = true;
          this.gaEventErrorValidateCoupon(false);
        },
        (err) => {
          this.gaEventErrorValidateCoupon(true);
          let errors = new Array();
          errors[401] = {
            message:"Error al validar"
          }
          errors[402] = {
            message:"No se encontró ningún bono con el código ingresado"
          }
          errors[403] = {
            message:"El bono ya fue redimido"
          }
          errors[404] = {
            message:"El bono ingresado no se encuentra activo"
          }
          errors[405] = {
            message:"El bono ingresado se encuentra vencido"
          }
          errors[406] = {
            message:"Tipo de cliente no válido"
          }
          errors[407] = {
            message:"El bono ha superado el límite de redenciones"
          }
          this.isLoading = false;
          if(errors[err.status])
          {
            this.error = errors[err.status].message;
          }
          else 
          {
            this.error = 'Hubo un problema, por favor intenta de nuevo';
          }
        })
    }
  }

}

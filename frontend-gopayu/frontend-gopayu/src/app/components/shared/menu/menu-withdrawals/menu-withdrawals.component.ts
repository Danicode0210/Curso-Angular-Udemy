import { MatDialogRef } from '@angular/material';
import { AppState } from './../../../../app.state';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuService } from 'src/app/services/menu.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu-withdrawals',
  templateUrl: './menu-withdrawals.component.html',
  styleUrls: []
})
export class MenuWithdrawalsComponent implements OnInit {


  public isLoading: boolean = false;
  public methodId: number = 1;
  public formData: FormGroup;
  public formError: string = '';
  public formSuccess:string = "";
  public texts$;
  public assetsSubscription: Subscription;
  public localTexts$;
  public accountWithdrawalActivated: boolean = true;
  public selectIsHidden:boolean = false;
  public textBotonProceed = 'Proceder';
  public textDropDownMethod = [
    'Retiro En Punto De Venta - Codigo PIN',
    'Retiro por cuenta bancaria'
  ];
  constructor(private service:MenuService, private store:Store<AppState>, private dialogRef:MatDialogRef<MenuWithdrawalsComponent>) {

    /* Save form */
    this.formData = new FormGroup({
      value: new FormControl('', [
        Validators.required
      ])
    });

    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.texts$ = assets.texts;
      this.localTexts$ = assets.i18n;
      if (this.localTexts$.AccountWithdrawal) {
        this.accountWithdrawalActivated = this.localTexts$.AccountWithdrawal.isActived;
      }
    });

  }

  closeModal()
  {
      this.dialogRef.close();
  }

  ngOnInit() {
  }

  gaEventWithdraw(): void {
    const withdrawalValue = this.formData.controls.value.value.split('.').join('');
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Retirar saldo',
      label: this.textBotonProceed + ' - ' + (this.formError === '' ? 'Exitoso' : 'Fallido'),
      value: withdrawalValue,
      metodoRecarga: this.textDropDownMethod[(this.methodId - 1)]
    };
    window.dataLayer.push(event);
  }

  makeWithdraw() {
    this.formError = '';
    this.formSuccess = '';
    if (this.formData.status == 'VALID') {
      var val = this.formData.value.value.replace(/\./g, "");
      /* Get session data */
      var userdata = JSON.parse(localStorage.getItem('profile'));

      if (parseInt(val) < 2000) {
        this.formError = 'MinimalWithdraw';
      }
      else
      {
        /**
         * Validate active bonuses
         */
        var balance:any = localStorage.getItem('balance');

        if(balance)
        {
          balance = JSON.parse(balance);

          if(balance.bonusBalance > 0)
          {
            if(!confirm(`Si realiza el retiro, perderá su dinero de bono (${String(balance.bonusBalance).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} $). ¿Desea continuar?`))
            {
              return false;
            }
          }
        }

        var rand:any = Math.random() * 10;
        var wait:any = parseInt(rand);
        var rand2:any = Math.random() * 10;
        var plus:any = parseInt(rand2);
        var total = wait + plus;

        if(total > 8)
        {
            total = Math.abs(wait - plus) + rand/2;
        }
        this.isLoading = true;
        setTimeout(() => {
          this.service.pinwithdraw(val, userdata.identityDocument.number)
          .subscribe((response: any) => {
            this.isLoading = false;
            if(response.Code == 200)
            {
              if(response.data.transactionInfo.status)
              {
                  if(response.data.transactionInfo.status == 'En proceso')
                  {
                    this.formSuccess = "Retiro exitoso, por favor valide su pin a través de un mensaje de texto en su teléfono móvil.";
                  }
                  else
                  {
                    this.formSuccess = "Retiro exitoso, por favor valide su pin a través de un mensaje de texto en su teléfono móvil.";
                  }
              }
              else
              {
                this.formSuccess = "Retiro exitoso, por favor valide su pin a través de un mensaje de texto en su teléfono móvil.";
              }
            }
            else
            {
              this.formError = "GeneralError";
            }
            this.gaEventWithdraw();
          },
            (err: any) => {
              this.isLoading = false;
              console.log(err);
              if(err.status == 422)
              {
                if (err.error.errorCode)
                {
                  this.formError = err.error.errorCode;
                }
                else if(err.error.message)
                {
                  this.formError = err.error.message;
                }
              }
              else
              {
                this.formError = "GeneralError";
              }
            }
          );
        }, total*1000)
      }

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
}

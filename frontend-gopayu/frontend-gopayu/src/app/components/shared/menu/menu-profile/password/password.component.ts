import { AppState } from './../../../../../app.state';
import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Subscription } from "rxjs"
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: []
})
export class PasswordComponent implements OnInit {

  public formData: FormGroup;
  public formSuccess:string = '';
  public formError:string = '';
  public isLoading:boolean = false;
  public assetsSubscription: Subscription;
  public textBotonCancelar = 'Cancelar';
  public textBotonGuardar = 'Guardar';
  public disableSupmit = false;

  @Output()
  private changePage = new EventEmitter();

  @Output()
  private updatedPassword = new EventEmitter();
  public texts$;

  constructor(private service:MenuService, private store:Store<AppState>) { }

  ngOnInit() {
      this.assetsSubscription = this.store.select('assets').subscribe( assets => {
        this.texts$ = assets.i18n;
      });
      
       /* Save form */
      this.formData = new FormGroup({
        password: new FormControl('', [
          Validators.required
        ]),
        cnfPassword: new FormControl('', [
          Validators.required
        ]),
        currentPassword: new FormControl('', [
          Validators.required
        ]),
      });
  }

  changePass()
  {
      this.gaEventUpdatePassword(this.textBotonGuardar);
      this.formError = '';
      this.formSuccess = '';
      if(this.formData.value.password != this.formData.value.cnfPassword)
      {
          this.formError = 'PasswordNotMatch';
      }
      else if(this.formData.status == 'VALID')
      {
          this.isLoading = true;

          this.service.changePassword(this.formData.value.currentPassword, this.formData.value.password)
          .subscribe((response:any) => {
            this.isLoading = false;
            this.updatedPassword.emit();
          }, 
          (err) => {
            this.isLoading = false;
            console.log(err);
            if(err.status)
            {
              let message = JSON.parse(err.error);
              // se extraen las dos primeras palabras y se fusionan
              message = message.message.split(/[\.,]+/);
              message = message[0];
              message = message.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); }).replace(/\s/g, '').replace(/^(.)/, function($1) { return $1.toLowerCase(); });
              this.formError = message;
            }
          });
      }
  }

  gaEventUpdatePassword(labels: string): void {
    const event = {
      event: 'ga_event',
      category: 'Mi Cuenta',
      action: 'BPW - Cambiar contraseña',
      label: labels
    };
    window.dataLayer.push(event);
  }

  goBack()
  {
    this.gaEventUpdatePassword(this.textBotonCancelar);
      this.changePage.emit();
  }
}

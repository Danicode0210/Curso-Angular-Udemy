import { AppState } from './../../app.state';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Observable } from "rxjs"
import { LoginService } from '../../services/login.service'
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-recovery-update-password',
  templateUrl: './recovery-update-password.component.html',
  styleUrls: []
})
export class RecoveryUpdatePasswordComponent implements OnInit {

  public formData: FormGroup;
  public isLoading:boolean = false;
  public formError:string = '';
  public formSuccess:string = '';
  public SecurityKey:any = '';
  public matcher = new MyErrorStateMatcher();
  public texts: any;
  public assetsSubscription: Subscription;
  public terms: any;
  public i18n: any;
  public textBotonRecovery = 'Aceptar';

  constructor(private service:LoginService, private store:Store<AppState>, private activatedRoute: ActivatedRoute) {
    /* Save form */
    this.formData = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        Validators.pattern(/^[0-9A-Za-z\s]*$/)
      ]),
      cnfPassword: new FormControl('', [
        Validators.required
      ])
    });

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.SecurityKey = params['SecurityKey'];
    });
    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.texts = assets.texts;
      this.terms = assets.terms;
      this.i18n = assets.i18n;
    });
  }

  gaEventUpdateRecoveryDone() {
    const event = {
      event: 'ga_event',
      category: 'Recuperar clave',
      action: 'BPW - Confirmacion',
      label: this.textBotonRecovery
    };
    window.dataLayer.push(event);
  }

  updatePassword()
  {
    this.gaEventUpdateRecoveryDone();
    this.formSuccess = '';
    this.formError = '';
    if(this.formData.status == 'VALID')
      {
          if(this.formData.value.password != this.formData.value.cnfPassword)
          {
              this.formError = 'PasswordNotMatch';
          }
          else
          {
              this.isLoading = true;

              this.service.updatePassword(this.formData.value.password, this.SecurityKey)
              .subscribe(() => {
                  this.formSuccess = 'SuccessUpdate';
              },
              err => {
                  this.isLoading = false;

                  if(err.error.message)
                  {
                    this.formError = (err.error.message == 'Invalid request, password already used') ? 'La contrasela ya ha sido utilizada antes' : err.error.message;
                  }
                  else 
                  {
                    this.formError = 'ErrorUpdate';
                  }
            })
          }
      }
  }

}

import { AppState } from './../../../../../app.state';
import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Subscription } from "rxjs"
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { AcceptLimitsComponent } from './accept-new-limits/accept-limits.component';
import { RejectedLimitsComponent } from './rejected-limits/rejected-limits/rejected-limits.component';

@Component({
  selector: 'app-autolimits',
  templateUrl: './autolimits.component.html',
  styleUrls: []
})
export class AutolimitsComponent implements OnInit {

  public formData: FormGroup;
  public formSuccess:string = '';
  public formError:string = '';
  public formWarning: string = '';
  public isLoading:boolean = true;
  public texts$;
  public localTexts$;
  public assetsSubscription: Subscription;
  public currentLimits:Object = {};
  public textBotonGuardar = 'Guardar';
  public textBotonCancelar = 'Cancelar';

  public acceptedLimits = false;
  public acceptedLimitsMessage = '';
  @Output() private changePage = new EventEmitter();

  constructor(private service:MenuService,
              private store:Store<AppState>,
              private dialog: MatDialog
              ) { 
       /* Save form */
       this.formData = new FormGroup({
        monthLimit: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ]),
        weekLimit: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ]),
        daylyLimit: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ]),
      });
  }

  ngOnInit() {
      this.getPlayerLimits();
      this.assetsSubscription = this.store.select('assets').subscribe( assets => {
        this.texts$ = assets.texts;
        this.localTexts$ = assets.i18n;
      });
  }

  setAutoLimitsSisplay(){
    this.formError = '';
    this.formSuccess = '';

    if(this.formData.status == 'VALID')
    {
        var daylyLimit = this.formData.value.daylyLimit.replace(/\./g,'');
        var monthLimit = this.formData.value.monthLimit.replace(/\./g,'');
        var weekLimit = this.formData.value.weekLimit.replace(/\./g,'');

        const daylyLimitNumeric = parseInt(this.formData.value.daylyLimit.replace(/\./g,''));
        const monthlyLimitNumeric = parseInt(this.formData.value.monthLimit.replace(/\./g,''));
        const weeklyLimitNumeric = parseInt(this.formData.value.weekLimit.replace(/\./g,''));

        if (daylyLimitNumeric > monthlyLimitNumeric) {
          return this.formError = 'WrongDaylyLimitMonthly';
        }

        if (daylyLimitNumeric > weeklyLimitNumeric) {
          return this.formError = 'WrongDaylyLimitWeekly';
        }

        if (weeklyLimitNumeric > monthlyLimitNumeric) {
          return this.formError = 'WrongWeeklyLimitMontly';
        }
        if(
          (daylyLimit == this.currentLimits['DIARIO'].quantity) &&
          (weekLimit == this.currentLimits['SEMANAL'].quantity) &&
          (monthLimit == this.currentLimits['MENSUAL'].quantity)
        )
        {
          return this.formError = 'LimitsNotUpdated';
        }
        else 
        {
          if(daylyLimit == this.currentLimits['DIARIO'].quantity)
          {
            daylyLimit = null;
          } 

          if(weekLimit == this.currentLimits['SEMANAL'].quantity)
          {
            weekLimit = null;
          } 

          if(monthLimit == this.currentLimits['MENSUAL'].quantity)
          {
            monthLimit = null;
          } 
        }
        this.isLoading = true;

        this.service.updateAutolimits(weekLimit,daylyLimit,monthLimit)
        .subscribe((response:any) => {
            this.isLoading = false;
            this.formSuccess = 'La solicitud se ha realizado correctamente, si tus límites disminuyeron la solicitud se verá reflejada automáticamente, en caso contrario deberás esperar a que la solicitud se apruebe';
            this.getPlayerLimits();
          },
        (err) => {
          this.isLoading = false;
          if(err.status == 422)
          {
              this.formError = 'Tienes solicitudes pendientes por aprobación, si disminuiste alguno de tus límites los cambios se aplicarán automáticamente, si incrementaste tus límites debes esperar a que las solicitudes pendientes sean aprobadas o rechazadas';
          }
          else
          {
              this.formError = 'RequestError';
          }
        });
    }
  }

  setAutoLimits()
  {   
    this.gaEventAutoLimits(this.textBotonGuardar);
    if(localStorage.getItem('isSisplay') && localStorage.getItem('isSisplay') == 'true')
    {
      this.setAutoLimitsSisplay();
      return ;
    }

      this.formError = '';
      this.formSuccess = '';

      if(this.formData.status == 'VALID')
      {
          this.isLoading = true;
          var daylyLimit = this.formData.value.daylyLimit.replace(/\./g,'');
          var monthLimit = this.formData.value.monthLimit.replace(/\./g,'');
          var weekLimit = this.formData.value.weekLimit.replace(/\./g,'');
          
          if (this.formError === '') {
            this.service.updateAutolimits(weekLimit,daylyLimit,monthLimit)
            .subscribe((response:any) => {
                this.isLoading = false;
                this.formSuccess = 'SuccessUpdate';
            },
            (err) => {
              this.isLoading = false;

              if(err.status == 422)
              {
                  this.formError = "LimitsNotUpdated";
              }
              else
              {
                  this.formError = 'RequestError';
              }
            });
          }
      }
  }

  getPlayerLimits()
  {
      this.service.getCurrentLimits()
      .subscribe((response:any) => {
          this.isLoading = false;
          if(localStorage.getItem('isSisplay') && localStorage.getItem('isSisplay') == 'true')
          {
            this.currentLimits = {
              [response.ArrayLimits[0].limits[0].duration.periodUnity]:{ periodUnity: response.ArrayLimits[0].limits[0].duration.periodUnity, quantity: response.ArrayLimits[0].limits[0].quantity},
              [response.ArrayLimits[1].limits[0].duration.periodUnity]:{ periodUnity: response.ArrayLimits[1].limits[0].duration.periodUnity, quantity: response.ArrayLimits[1].limits[0].quantity},
              [response.ArrayLimits[2].limits[0].duration.periodUnity]:{ periodUnity: response.ArrayLimits[2].limits[0].duration.periodUnity, quantity: response.ArrayLimits[2].limits[0].quantity}
            };
            for(let i = 0; i < response.ArrayLimits.length; i++){
  
              let limits = response.ArrayLimits[i].limits;
  
              for(let j = 0; j < limits.length; j++) {
  
                  let limit = limits[j];
  
                  if(limit.duration.periodUnity === "DIARIO")
                  {
                      this.formData.patchValue({
                          daylyLimit: limit.quantity.toString(), 
                      });
                      this.numberFormat('daylyLimit');
                  }
                  else if(limit.duration.periodUnity === "SEMANAL")
                  {
                      this.formData.patchValue({
                          weekLimit: limit.quantity.toString(), 
                      });
                      this.numberFormat('weekLimit');
                  }
                  else if(limit.duration.periodUnity === "MENSUAL")
                  {
                      this.formData.patchValue({
                          monthLimit: limit.quantity.toString(),
                      });
                      this.numberFormat('monthLimit');
                  }
              }
            }

            const newLimits = [];
            const pendingAcceptanceLimits = [];
            const rejectedLimits = [];
            const limitRequests = response.ArrayRequests;
            limitRequests.forEach(element => {
              if (element.valorSolicitud !== element.valorActual && element.estadoSolicitud === 95) {
                newLimits.push(element);
              }

              if (element.estadoSolicitud === 94) {
                pendingAcceptanceLimits.push(element);
              }

              if (element.estadoSolicitud === 96) {
                rejectedLimits.push(element);
              }
            });
            if (newLimits.length > 0) {
              const dialogRef = this.dialog.open(AcceptLimitsComponent, {
                panelClass: 'menu-dialog',
                data: {newLimits: newLimits, acceptedLimits: this.acceptedLimits}
              });
              dialogRef.afterClosed().subscribe((data) => {
                this.getPlayerLimits();
                if (data !== undefined) {
                  if (data.acceptedLimits) {
                    this.acceptedLimitsMessage = 'Sus limites se han actualizado exitosamente.';
                  }
                }
              });
            }

            if (pendingAcceptanceLimits.length > 0) {
              const requestDate: any = new Date(pendingAcceptanceLimits[0].fechaSolicitud);
              const actualDate: any = new Date();
              requestDate.setHours(requestDate.getHours() + 72);

              // Se calcula la diferencia entre la fecha actual y la supuesta fecha de aceptacion de limites
              const diffTime = Math.abs(requestDate - actualDate);

              const hours = Math.floor(diffTime / 3600000);

              const displayHours = hours > 0 ? hours + ' horas ' : '';

              const warning = 'Actualmente tiene una solicitud de cambio de límites por ser aprobada, en ' + hours + ' horas se sabrá la respuesta de su solicitud';
              this.formWarning = warning;
            }

            if (rejectedLimits.length > 0) {
              const dialogRef = this.dialog.open(RejectedLimitsComponent, {
                panelClass: 'menu-dialog',
                data: {rejectedLimits: rejectedLimits}
              });
            }
          } else if(response.ArrayLimits[0])
          {
            for(let i = 0; i < response.ArrayLimits[0].limits.length; i++)
            { 
                var limit = response.ArrayLimits[0].limits[i];
  
                if(limit.duration.periodUnity == "Day")
                {
                    this.formData.patchValue({
                        daylyLimit: limit.quantity.toString(), 
                    });
                    this.numberFormat('daylyLimit');
                }
                else if(limit.duration.periodUnity == "Week")
                {
                    this.formData.patchValue({
                        weekLimit: limit.quantity.toString(), 
                    });
                    this.numberFormat('weekLimit');
                }
                else if(limit.duration.periodUnity == "Month")
                {
                    this.formData.patchValue({
                        monthLimit: limit.quantity.toString(), 
                    });
                    this.numberFormat('monthLimit');
                }
            }
          }
      },
      () => {
        this.isLoading = false;
      });
  }

  numberFormat(field) 
  {    
      var num = this.formData.value[field].replace(/\./g,'');

      if(!isNaN(num))
      {
          num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
          num = num.split('').reverse().join('').replace(/^[\.]/,'');
          this.formData.patchValue({
            [field]: num 
          });
      }
      else
      { 
          this.formData.patchValue({
            [field]: this.formData.value[field].replace(/[^\d\.]*/g,''), 
          });
      }
  }

  gaEventAutoLimits(buttonLabel: string): void {
    const month = this.formData.controls.monthLimit.value;
    const week = this.formData.controls.weekLimit.value;
    const day = this.formData.controls.daylyLimit.value;
    const monthlyLimit = month.replace(/\./g, '');
    const weeklyLimit = week.replace(/\./g, '');
    const dailyLimit = day.replace(/\./g, '');
    const event = {
      event: 'ga_event',
      category: 'Mi Cuenta',
      action: 'BPW - Juego responsable',
      label: 'Autolimites - ' + buttonLabel,
      limiteMensual: (buttonLabel === 'Cancelar' ? '' : monthlyLimit)
      ,
      limiteSemanal: (buttonLabel === 'Cancelar' ? '' : weeklyLimit),
      limiteDiario: (buttonLabel === 'Cancelar' ? '' : dailyLimit)
    };
    window.dataLayer.push(event);
  }
 

  goBack()
  {
      this.gaEventAutoLimits(this.textBotonCancelar);
      this.changePage.emit();
  }
}

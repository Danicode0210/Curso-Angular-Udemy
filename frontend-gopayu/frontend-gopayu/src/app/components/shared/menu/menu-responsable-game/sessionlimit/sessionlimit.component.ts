import { LoginService } from './../../../../../services/login.service';
import { AppState } from './../../../../../app.state';
import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sessionlimit',
  templateUrl: './sessionlimit.component.html',
  styleUrls: []
})
export class SessionlimitComponent implements OnInit {

  public isLoading:boolean = true;
  public formSuccess:string = '';
  public formError:string = '';
  public limits:any;
  public duration:any;
  @Output() private changePage = new EventEmitter();
  public texts$;
  public assetsSubscription: Subscription;
  public textBotonGuardar = 'Guardar';
  public textBotonCancelar = 'Cancelar';

  public sessionLimits:any = [
    {text:"1 minuto", value: 1},
    {text:"30 minutos", value: 30},
    {text:"1 hora", value: 60},
    {text:"2 horas", value: 120},
    {text:"3 horas", value: 180},
    {text:"5 horas", value: 300},
    {text:"Ilimitado", value: 1440}
  ];

  public textTime = {
    1: '1 Minuto',
    30: '30 Minutos',
    60: '1 Hora',
    120: '2 Horas',
    180: '3 Horas',
    300: '5 Horas',
    1440: 'Ilimitado'
  };

  constructor(private service:MenuService, private store:Store<AppState>, private loginService:LoginService) {
    if(localStorage.getItem('isSisplay') && localStorage.getItem('isSisplay') == 'true')
    {
      this.sessionLimits[6].value = 1440;
    } 
   }

  ngOnInit() {
    this.getSessionLimits();
    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.texts$ = assets.texts;
    });
  }


  getCurrentSessionLimits()
  {
    this.isLoading = true;

    this.service.getCurrentSessionLimits()
    .subscribe((response:any) => {
        this.isLoading = false;
        this.duration = response.duration;
    },
    () => {
      this.isLoading = false;

    })
  }


  setSessionLimit()
  {
      this.gaEventSessionLimit(this.textBotonGuardar);
      this.isLoading = true;
      this.formError = '';
      this.formSuccess = '';

      this.service.setSessionLimit(this.duration)
      .subscribe(response => {
        this.isLoading = false;

        this.loginService.refreshToken().subscribe((response:any) => {
            localStorage.removeItem("session");
            localStorage.setItem("session", JSON.stringify(response));
            localStorage.removeItem("refreshing");
            localStorage.setItem("minTokenRefresh", (new Date().getTime()+500000).toString());
        },
        err => {
          localStorage.removeItem("refreshing");
          localStorage.clear();
          location.reload();
        });
        this.formSuccess = 'SuccessUpdate';
        this.getSessionLimits();
      },
      () =>{
        this.isLoading = false;
        this.formError = 'RequestError';
      })
  }

  gaEventSessionLimit(buttonLabel: string): void {
    const selectedTime = this.duration;
    const event = {
      event: 'ga_event',
      category: 'Mi Cuenta',
      action: 'BPW - Juego responsable',
      label: 'Límite de sesión - ' + buttonLabel,
      tiempoLimiteSesion: (buttonLabel === 'Cancelar' ? '' : this.textTime[selectedTime])
    };
    window.dataLayer.push(event);
  }

  goBack()
  {
      this.gaEventSessionLimit(this.textBotonCancelar);
      this.changePage.emit();
  }
  getSessionLimits()
  {
      this.isLoading = true;

      this.service.getSessionLimits()
      .subscribe((response:any) => {
        this.isLoading = false;
        this.limits = response;
        if(response.length > 0)
        {  
          this.duration = response[response.length - 1].duration;
        }
      },
      err => {
          this.isLoading = false;
      })
  }

}

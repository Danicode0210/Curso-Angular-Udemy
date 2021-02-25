import { AppState } from './../../../../../app.state';
import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-autoexclusion',
  templateUrl: './autoexclusion.component.html',
  styleUrls: []
})
export class AutoexclusionComponent implements OnInit {

  public exclusions:any;
  public duration:any;
  public isLoading:boolean = true;
  public formSuccess:string = '';
  public formError:string = '';
  public lastRequest:any;
  public assetsSubscription: Subscription;
  public texts$;
  public textBotonGuardar = 'Guardar';
  public textBotonCancelar = 'Cancelar';
  public exclusionOptions:Array<Object> = [
    {text: "24 horas", value:24},
    {text: "48 horas", value:48},
    {text: "72 horas", value:72},
    {text: "1 semana", value:168},
    {text: "1 mes", value:720},
    {text: "3 mes", value:2160},
    {text: "6 mes", value:4320},
    {text: "Ilimitado", value:87600}
  ];

  public textTime = {
    24: '24 Horas',
    48: '48 Horas',
    72: '72 Horas',
    168: '1 Semana',
    720: '1 Mes',
    2160: '3 Meses',
    4320: '6 Meses',
    87600: 'Ilimitado'
  };

  @Output() private changePage = new EventEmitter();

  constructor(private service:MenuService, private store:Store<AppState>) { }

  ngOnInit() {
    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.texts$ = assets.texts;
    });

    this.getExclusions();
  }

  getExclusions()
  {   
      this.isLoading = true;

      this.service.getExclusions()
      .subscribe((response:any) => {
           this.isLoading = false;
           this.exclusions = response;
           if(response.length > 0)
           {
              this.lastRequest = response[0];
           }
      },
      err => {
          this.isLoading = false;
      })
  }

  makeExclusion()
  {
      this.gaEventAutoExclusion(this.textBotonGuardar);
      this.isLoading = true;
      this.formError = '';
      this.formSuccess = '';

      this.service.makeExclusion(this.duration)
      .subscribe(response => {
        this.isLoading = false;
        this.formSuccess = 'SuccessUpdate';
        this.getExclusions();
      }, 
      () =>{
        this.isLoading = false;
        this.formError = 'RequestError';
      })
  }

  Date(_date)
  {   
      return (new Date(_date) < new Date());
  }

  gaEventAutoExclusion(buttonLabel: string): void {
    const hours = this.textTime[this.duration];
    const event = {
      event: 'ga_event',
      category: 'Mi Cuenta',
      action: 'BPW - Juego responsable',
      label: 'Autoexclusión - ' + buttonLabel,
      tiempoAutoexclusion: (buttonLabel === 'Cancelar' ? '' : hours)
    };
    window.dataLayer.push(event);
  }

  goBack()
  {
    this.gaEventAutoExclusion(this.textBotonCancelar);
      this.changePage.emit();
  }
}

import { AssetsService } from './../../../services/assets.service';
import { Store } from '@ngrx/store';
import { AppState } from './../../../app.state';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.styl']
})
export class CallbackComponent implements OnInit {

  public form:FormGroup;
  public isSubmited: boolean = false;
  public success:string = '';
  public error:string = '';
  public assetsSubscription: Subscription;
  public localTexts$;

  @Input()
  public isOpen: boolean = false;

  constructor(private store:Store<AppState>, private service:AssetsService) { 

    this.form = new FormGroup({
      name: new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s]*$/)]),
      email: new FormControl('',[Validators.required, Validators.email]),
      id: new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(12), Validators.pattern(/^[0-9\s]*$/)]),
      mobilePhone: new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^3[0-9\s]*$/)]),
      message: new FormControl('',[Validators.required]),
      terms: new FormControl('',[Validators.required]),
    });

  }

  ngOnInit() {

    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.localTexts$ = assets.i18n;

      if(this.localTexts$.CallbackMessage && this.localTexts$.CallbackMessage.isActivated)
      {
        this.error = this.localTexts$.CallbackMessage.Messsage;
      }
    });
  }

  sendCallBack()
  { 
    this.isSubmited = true;
    this.error = "";
    this.success = "";
    if(this.form.status == 'VALID')
    { 
      
      
      var now:any = new Date();
      var last:any = new Date().setHours(22);
      var start:any = new Date().setHours(6);
      if(localStorage.getItem('lastCallbackSend') && new Date().getTime()-3600000 < parseInt(localStorage.getItem('lastCallbackSend')))
      {
        this.error = "¡Ya tienes un registro en proceso, por favor espéranos un momento a que nos comuniquemos, muchas gracias!";
      }
      else 
      { 
          this.service.getCurrentTime()
          .subscribe((response) => {
            if(new Date(response['time']*1000).getHours() >= 6 && new Date(response['time']*1000).getHours() <= 22){
              var fecha:any = "2020-08-21";
              var hora:any = "08:00";
              var sumahour="";
              var horasep= hora.split(":");
              var hora1 =horasep[0];
              var hora2=horasep[1];
              var sumahour1: any= parseInt(hora1)+parseInt("5");
              var resulthour=sumahour1+":"+hora2;
            
              var datehour = fecha+"T"+resulthour+":00";
    
              var win = window.open("https://api-col-prod.crossnet.la/WebApiCallback/api/WebCallback?cliente=Betplay&userName="+this.form.value.name+"&number=57"+this.form.value.mobilePhone+"&ID="+this.form.value.id+"&message="+this.form.value.message+"&email="+this.form.value.email+"&zona=2"+"&scheduleTime="+datehour, "1366002941508",  "width=10,height=10,left=15,top=10");
              setTimeout(() => {
                  win.close()
                  var timestr:string = new Date().getTime().toString()
                  localStorage.setItem("lastCallbackSend",timestr);
                  this.form.reset();
                  this.success = "Tus datos han sido enviados con éxito, un agente se comunicará contigo";
                  this.isSubmited = false;
              }, 1500);
            }
            else
            {
              this.error = "Nuestro horario de atención es de 06:00 am a 10:00 pm";
            }
          }, (err) => {
            this.error = "Huno un error, por favor intenta más tarde";
          })
         
      }
      
    }
  }

  close()
  {
    window['$']('#callbackCB').addClass('d-none');
  }

}

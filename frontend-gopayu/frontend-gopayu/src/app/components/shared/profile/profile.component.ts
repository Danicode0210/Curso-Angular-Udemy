import { LoginService } from './../../../services/login.service';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppState } from './../../../app.state';
import { Store } from '@ngrx/store';
import { ToggleMenuAction } from 'src/app/redux/actions/ui.actions';
import { Subscription } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  public isOpen: boolean = false;
  public assetsSubscription: Subscription;
  public assets: any;
  private isBrowser: boolean;
  public isAuth: boolean;
  public timer:Date = new Date();
  public sessionTimer;
  public userdata;
  public balance;
  public lastLogin;
  public isLoading: boolean = false;
  public textBotonLogout = 'Cerrar Sesion';
  public textLinkProfile = 'Ver Menu';
  public textLinkVerSaldo = 'Ver Saldo';

  @Input()
  public bonusNotifications:number = 0;

  constructor( @Inject(PLATFORM_ID) platformId: Object, 
                private service:LoginService,
                private store:Store<AppState> 
  ) { 
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.store.select('ui').subscribe( ui => this.isOpen = ui.isOpen );

    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.assets = assets;
    });

    if(this.isBrowser)
    {
      if(localStorage.getItem('session'))
      { 
        this.isAuth = true;
      }

      setInterval(() => {
          this.timer = new Date();
          this.balance = JSON.parse(localStorage.getItem("balance"));
      },1000);

      this.userdata = JSON.parse(localStorage.getItem("profile"));
      this.balance = JSON.parse(localStorage.getItem("balance"));
      this.lastLogin = localStorage.getItem("lastLogin");

      var eventTime= parseInt(localStorage.getItem("duration")) || 0;
      var currentTime = (localStorage.getItem("duration")) ?  new Date().getTime() : 0;
      var diffTime = (localStorage.getItem("duration")) ? currentTime - eventTime : eventTime + currentTime;
      var duration:any = (localStorage.getItem("duration")) ? moment.duration(diffTime, 'milliseconds') : moment.duration(diffTime*1000, 'milliseconds');
      var interval = 1000;

      if(!localStorage.getItem("duration"))
      {
          let currentTimer:any = new Date().getTime();
          localStorage.setItem("duration", currentTimer);
      }

      setInterval(() => {
        duration = moment.duration(duration + interval, 'milliseconds');
          this.sessionTimer = this.pad(duration.hours(),2,null) + ":" + this.pad(duration.minutes(),2,null) + ":" + this.pad(duration.seconds(), 2, null);
      }, interval);
    }
  }

  toggleSidebar(){
    this.store.dispatch( new ToggleMenuAction( !this.isOpen ) );
  }

  pad = function(n, width, z){
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }


  gaEventLogout() {
    if (this.isBrowser) {
      const event = {
        event: 'ga_event_login',
        category: 'Iniciar sesion',
        action: 'BPW - Login',
        label: this.textBotonLogout
      };
      window.dataLayer.push(event);
    }
  }

  gaEventProfile(name: any) {
    const eventId = name.id;
    if (this.isBrowser) {
      const event = {
        event: 'ga_event',
        category: 'Perfil usuario',
        action: 'BPW - Perfil',
        label: eventId === 'spanUser' ? this.textLinkProfile : this.textLinkVerSaldo
      };
      window.dataLayer.push(event);
    }
  }

  logout()
  {   
      var session:any = JSON.parse(localStorage.getItem('session'));

      this.isLoading = true;

      if(session)
      {
        this.service.logout(session.accessToken)
        .subscribe(() => {
            this.removeLocalStorage();
            window.location.href = '/';
        },
        () => {
          this.removeLocalStorage();
          window.location.href = '/';
        });
      }
      else
      {
        this.removeLocalStorage();
        window.location.href = '/';
      }
      this.gaEventLogout();
  }

  removeLocalStorage()
  {
      localStorage.removeItem('session');
      localStorage.removeItem('profile');
      localStorage.removeItem('duration');
      localStorage.removeItem('kambiToken');
      localStorage.removeItem('balance');
      localStorage.removeItem('balanceLetUpdate');
      localStorage.removeItem('balanceMinAge');
  }

}

import { MatSnackBar } from '@angular/material';
import { SlotsService } from './../../../services/slots.service';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { AppState } from './../../../app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToggleMenuAction } from 'src/app/redux/actions/ui.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  public isOpen: boolean = false;
  public assetsSubscription: Subscription;
  public assets: any;
  public isAuth: boolean = false;
  private isBrowser: boolean;
  public slots;
  public textBotonIniciarSesion = 'Iniciar Sesion';
  public textBotonRegister = 'Registrarse';
  public textLinkSearch = 'Buscar Slots';
  public searchTerm = '';

  @Input()
  public bonusNotifications:number = 0;

  constructor( private slotsService:SlotsService, 
               private store:Store<AppState>, 
               private snackBar:MatSnackBar,
               @Inject(PLATFORM_ID) platformId: Object
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

      document.body.addEventListener('click', () => this.slots = undefined, true); 
    }
  }

  gaEventHeader(): void {
    const event = {
      event: 'ga_event',
      category: 'Header',
      action: 'BPW - Logo',
      label: 'Ir a inicio'
    };
    window.dataLayer.push(event);
  }

  gaEventLogin(clickEvent: any): void {
    const buttonId = clickEvent.target.attributes.id.nodeValue;
    let event;
    if (this.isBrowser) {
      if (buttonId === 'dropdownLogin') {
        event = {
          event: 'ga_event_login',
          category: 'Iniciar sesion',
          action: 'BPW - Login',
          label: this.textBotonIniciarSesion
        };
      } else if (buttonId === 'register') {
        event = {
          event: 'ga_event',
          category: 'Registro',
          action: 'BPW - Login',
          label: this.textBotonRegister
        };
      }
    }
    window.dataLayer.push(event);
  }

  toggleSidebar(){
    this.store.dispatch( new ToggleMenuAction( !this.isOpen ) );
  }

  searchSlots(_criteria)
  {
    this.searchTerm = _criteria.value;
    this.slotsService.searchSlots(_criteria.value)
    .subscribe(response => {
      this.slots = response['data'];
    });
  } 
}

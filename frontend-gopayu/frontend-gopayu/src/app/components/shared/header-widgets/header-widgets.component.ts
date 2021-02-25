import { PromotionalmodalComponent } from './../promotionalmodal/promotionalmodal.component';
import { Store } from '@ngrx/store';
import { AppState } from './../../../app.state';
import { Subscription } from 'rxjs';
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog } from "@angular/material";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { MatSnackBar } from "@angular/material";

import { MenuDepositsComponent } from "./../menu/menu-deposits/menu-deposits.component";

@Component({
  selector: "app-header-widgets",
  templateUrl: "./header-widgets.component.html",
  styles: [],
})
export class HeaderWidgetsComponent implements OnInit {
  public isAuth: boolean;
  private isBrowser: boolean;
  public imgBets = "../../../../assets/img/header/mis-apuestas.png";
  public imgDeposit = "../../../../assets/img/header/dinero.png";
  public imgPlay = "../../../../assets/img/header/play.png";
  public imgChat = "../../../../assets/img/header/chat.png";
  public imgCallback = "../../../../assets/img/Diadema.svg";
  public imgApp = "../../../../assets/img/app_inactive.svg";
  public imgPromo = "../../../../assets/img/header/promociones.png";
  public isLiveChat:boolean = true;
  public Callback:boolean = true;
  public Promotions:boolean = true;
  public i18n;
  public assetsSubscription: Subscription;
  public texts$;
  public textLinkMisApuestas = 'Mis Apuestas';
  public textLinkRecarga = 'Recarga Aqui';
  public textLinkTransmision = 'Transmision En Vivo';
  public textLinkRedimePromociones = 'Redime Promociones';
  public textChat = 'Chat En Linea';
  public textTeLlamamos = '¿Prefieres Que Te Llamemos?';
  public textDescargaApp = 'Descargar la App Betplay';
  public isOpen:boolean = false;
  

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      if (localStorage.getItem("session")) {
        this.isAuth = true;
      }

      this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.texts$ = assets.texts;
        this.i18n = assets.i18n;
        if(this.i18n.Chat && this.i18n.Chat.livechat == 'active')
        {
          this.isLiveChat = true;
        }

        if(this.i18n.Callback)
        {
          this.Callback = true;
        }

        if(this.i18n.Promotions)
        {
          this.Promotions = true;
        }
        
      });
    }
  }

  toggleChat()
  { 
    this.gaEventHeader(this.textChat);
    
    if(!this.isLiveChat)
    {
      let button:any = document.querySelector('.chattigo-widget-trigger');
      button.click();
      document.getElementById('start-chat').onclick = function () {
        const event = {
          event: 'ga_event',
          category: 'Footer',
          action: 'BPW - Inicio chat',
          label: 'Comenzar Chat'
        };
        console.log(event);
        window.dataLayer.push(event);
      };
    }
    else 
    {
      
      document.getElementById("chat-button").click();
    }
  }

  setEventChat() {
    const doc = document.querySelector('.cx-submit.cx-btn.cx-btn-primary.i18n');
    console.log(document.querySelector('.cx-submit'));
    return 'ok';
  }

  OpenModal() {
    if (this.isAuth) {
      this.dialog.open(MenuDepositsComponent, {
        panelClass: "menu-dialog",
      });
    } else {
      this.snackBar.open("Debes iniciar sesión", "Cerrar", {
        duration: 3000,
      });
    }
  }

  openModalApp()
  {
    window['$']('#donwload-modal').removeClass('d-none');
  }

  openPromotionsModal()
  {

    if (this.isAuth) {
      this.dialog.open(PromotionalmodalComponent, {
        panelClass: "promotions-dialog",
      });
    } else {
      this.snackBar.open("Debes iniciar sesión", "Cerrar", {
        duration: 3000,
      });
    }
    
  }

  gaEventHeader(buttonLabel: string): void {
    const event = {
      event: 'ga_event',
      category: 'Header',
      action: 'BPW - Menú superior',
      label: buttonLabel
    };
    window.dataLayer.push(event);
  }
}

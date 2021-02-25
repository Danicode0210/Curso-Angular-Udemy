import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { MatDialog } from "@angular/material";

import { Store } from "@ngrx/store";

import { Subscription } from "rxjs";

import { AppState } from "./app.state";

import { AssetsService } from "./services/assets.service";
import { LoginService } from "./services/login.service";
import { SetAssetsAction, SetI18nAction } from "./redux/actions/assets.actions";
import { ToggleMenuAction } from "./redux/actions/ui.actions";
import { MenuBalanceComponent } from "./components/shared/menu/menu-balance/menu-balance.component";
import { MenuProfileComponent } from "./components/shared/menu/menu-profile/menu-profile.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.styl"],
})
export class AppComponent implements OnInit, OnDestroy {
  public title = "frontend";
  public uiSubscription: Subscription;
  public isOpen: boolean = false;
  public isLoading: boolean = true;
  public isAuth: boolean;
  private isBrowser: boolean;
  public texts$;
  public i18n;
  public assetsSubscription: Subscription;
  public isAndroid: boolean = false;
  public smartBannerOpen: boolean = false;
  public currentRoute: any = "";
  public balance:any = [];
  public bonuses:any = [];
  public bonusNotifications:number = 0;

  constructor(
    private loginService: LoginService,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private store: Store<AppState>,
    public dialog: MatDialog,
    private service:MenuService,
    private assetsService: AssetsService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      var ua = navigator.userAgent.toLowerCase();
      this.isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

      // if (
      //   !localStorage.getItem("smartBannerClose") ||
      //   parseInt(localStorage.getItem("smartBannerClose")) <
      //     new Date().getTime()
      // ) {
      //   this.smartBannerOpen = true;
      // }
      this.smartBannerOpen = true;


      this.router.events.subscribe((val) => {
        if (
          val instanceof NavigationEnd &&
          router.url.indexOf("#") === -1 &&
          router.url.indexOf("faq") === -1
        ) {
          if (
            window.location.pathname == "/cuenta" &&
            localStorage.getItem("session")
          ) {
            this.dialog.open(MenuProfileComponent, {
              panelClass: "menu-dialog",
            });
          } else if (
            window.location.pathname == "/balance" &&
            localStorage.getItem("session")
          ) {
            this.dialog.open(MenuBalanceComponent, {
              panelClass: "menu-dialog",
            });
          }

          this.isLoading = true;

          var timeW = 1000;

          if (
            window.location.pathname.indexOf("apuesta") > -1 ||
            window.location.pathname.indexOf("live") > -1
          ) {
            timeW = 3000;
          }

          setTimeout(() => (this.isLoading = false), timeW);
          this.onCloseMenu();
        }
      });
    }
  }

  getBonuses()
  {
    this.service.getBonuses()
    .subscribe((response) => {
        this.bonuses = response;
        localStorage.setItem('bonuses', JSON.stringify(response));
        this.balance.bonosPendientes = 0;

        for(var i = 0; i < this.bonuses.length; i++)
        {
          this.balance.bonosPendientes += this.bonuses[i].bonusBalance;
          if(this.bonuses[i].status == 'Active')
          {
            this.bonusNotifications++;
          } 
        }
        this.isLoading = false;
    },() => {
        this.isLoading = false;
    });
  }

  async ngOnInit() {
    // SCROLL HEADER FIXED
    
    // SCROLL HEADER FIXED END
    this.uiSubscription = this.store.select("ui").subscribe((ui) => {
      this.isOpen = ui.isOpen;
    });


    this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.texts$ = assets.texts;
        this.i18n = assets.i18n;
      });

    this.initRouteSetter();
    this.router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        setTimeout(() => {
          this.initRouteSetter();
        }, 100);
      }
    });
    this.getAssets();
    this.getI18N();

    setTimeout(() => {
      this.isLoading = false;
    }, 2500);

    if (this.isBrowser) {
      if (localStorage.getItem("session")) {
        this.isAuth = true;
        this.refreshToken();
        this.getBonuses();
      }

      if (this.i18n.Chat && this.i18n.Chat.livechat == "active") {
        await this.initChat();
      } else {
        if (
          !document.getElementById("rvt_contact_ChatBot") &&
          !localStorage.getItem("isApp")
        ) {
          // this.loadChattigo(this.i18n.Chat.chattigoUrl);
        }
      }
    }
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  initRouteSetter() {
    this.currentRoute = this.router.url;
    this.currentRoute =
      !(this.currentRoute.indexOf("mis-apuestas") == -1) ||
      !(this.currentRoute.indexOf("live") == -1) ||
      (this.currentRoute.indexOf("apuestas") != -1 &&
        this.currentRoute.indexOf("faq") == -1 &&
        this.currentRoute.indexOf("static") == -1 &&
        this.currentRoute.indexOf("apuestas-") == -1);
  }

  onCloseMenu() {
    this.store.dispatch(new ToggleMenuAction(false));
  }

  setAssets(assets) {
    this.store.dispatch(new SetAssetsAction(assets));
  }

  setI18N(data) {
    this.store.dispatch(new SetI18nAction(data));
  }

  getI18N() {
    this.assetsService.getLocalTexts().subscribe((response) => {
      this.setI18N(response);
    });
  }
  getAssets() {
    this.assetsService.getAssets().subscribe((response) => {
      this.setAssets(response["data"]);
    });
  }

  async initChat() {
    var win: any = window;
    var chatSrc = document.createElement("script");
    chatSrc.setAttribute("src", "http://cdn.livechatinc.com/tracking.js");
    document.head.append(chatSrc);

    win.__lc = win.__lc || {};
    win.__lc.license = 9697455;
    (function () {
      var lc = document.createElement("script");
      lc.type = "text/javascript";
      lc.async = true;
      lc.src =
        ("https:" == document.location.protocol ? "//" : "http://") +
        "cdn.livechatinc.com/tracking.js";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(lc, s);
    })();
  }

  loadChattigo(url = "https://cdn-webchat.chattigo.com/widget.js") {
    let chattigo = document.createElement("script");
    chattigo.setAttribute("src", url);
    chattigo.onload = () => {
      let win: any = window;
      var chat = new win.Webchat("betplay@WC11", {
        send_text: "Iniciar el chat2",
        login_text: "Iniciar el chat",
        width: 300,
        height: 500,
        locale: "es",
        name_field: "Nombre",
        baseUrl: "https://api-webchat.chattigo.com",
        header_text: "Betplay",
        welcome_text: "",
        subtitle_text:
          "Bienvenido a BetPlay! Para continuar, por favor ingresa tus datos y da clic en Iniciar el chat. Nuestro horario de atención es 7x24.",
        header_background_color: "#182549",
        header_font_color: "#ffffff",
        button_login_bg: "#182549",
        button_login_color: "#ffffff",
        toggle_custom:
          '<div class="lc-1aty6a1 extks11" style="display: flex; cursor:pointer; padding-top: .5em; width: 55px; height: 55px; box-shadow: rgba(0, 0, 0, 0.2) 0px 0.2em 0.8em; -webkit-box-pack: center; justify-content: center; position: relative; color: rgb(0, 0, 0); border-radius: 50%; background: #182549;"><button class="lc-uhzpuk e1m5b1js0" style="-webkit-appearance: none;display: inline-block;color: inherit;background: transparent;border-width: 0px;border-style: initial;border-color: initial;border-image: initial;margin: 0px;padding: 0px;"><svg width="28px" height="28px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" class="lc-sr3tuq e5ibypu0"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="agentonline" fill="#000000"><path d="M14,25.5 C12.4,25.5 10.8,25.2 9.4,24.7 L4.5,27.5 L4.5,21.9 C2,19.6 0.5,16.5 0.5,13 C0.5,6.1 6.5,0.5 14,0.5 C21.5,0.5 27.5,6.1 27.5,13 C27.5,19.9 21.5,25.5 14,25.5 L14,25.5 Z M9,11.5 C8.2,11.5 7.5,12.2 7.5,13 C7.5,13.8 8.2,14.5 9,14.5 C9.8,14.5 10.5,13.8 10.5,13 C10.5,12.2 9.8,11.5 9,11.5 L9,11.5 Z M14,11.5 C13.2,11.5 12.5,12.2 12.5,13 C12.5,13.8 13.2,14.5 14,14.5 C14.8,14.5 15.5,13.8 15.5,13 C15.5,12.2 14.8,11.5 14,11.5 L14,11.5 Z M19,11.5 C18.2,11.5 17.5,12.2 17.5,13 C17.5,13.8 18.2,14.5 19,14.5 C19.8,14.5 20.5,13.8 20.5,13 C20.5,12.2 19.8,11.5 19,11.5 L19,11.5 Z" id="Shape" style="cursor:pointer; fill: white;"></path></g></g></svg></button></div>',
        preserve_history: true,
        login_fields: [
          {
            label: "Nombre (*)",
            required: true,
          },
          {
            label: "Teléfono",
            validation: function (value) {
              var re = /^([0-9]{7,10})$/;
              if (!re.test(value)) {
                throw new Error("El valor del teléfono debe ser numerico");
              }
            },
          },
          {
            label: "¿Eres Usuario BetPlay?",
            choices: ["Si", "No"],
          },
        ],
        user_field: "Telefono",
        geo_active: false,
        attach: true,
        enable_print: false,
      });
      chat.init();
    };
    document.head.appendChild(chattigo);
  }

  refreshToken() {
    var session = localStorage.getItem("session");
    if (session) {
      if (
        parseInt(localStorage.getItem("balanceLetUpdate")) <
        new Date().getTime()
      ) {
        this.assetsService.getBalance().subscribe(
          (response) => {
            localStorage.setItem("balance", JSON.stringify(response));
            localStorage.setItem(
              "balanceLetUpdate",
              (new Date().getTime() + 120000).toString()
            );
          },
          () => {}
        );
      }
      setInterval(() => {
        if (!localStorage.getItem("session")) {
          localStorage.clear();
          location.reload();
          return false;
        }
        var expiresIn =
          JSON.parse(localStorage.getItem("session")).expiresIn * 1000;
        var maxAge = JSON.parse(localStorage.getItem("session")).maxAge * 1000;

        if(localStorage.getItem("isSisplay") && localStorage.getItem("isSisplay") == "true")
        {
            expiresIn = JSON.parse(localStorage.getItem("session")).expiresIn;
            maxAge = JSON.parse(localStorage.getItem("session")).maxAge;
        }

        var localMinAge = parseInt(localStorage.getItem("minTokenRefresh"));
        if (maxAge < new Date().getTime()) {
          localStorage.clear();
          location.reload();
        } else {
          if (
            maxAge != expiresIn &&
            localMinAge < new Date().getTime() + 20000 &&
            expiresIn < new Date().getTime() + 20000 &&
            !localStorage.getItem("refreshing")
          ) {
            localStorage.setItem("refreshing", "true");
            /*Refresh token*/
            this.loginService.refreshToken().subscribe(
              (response: any) => {
                localStorage.removeItem("session");
                localStorage.setItem("session", JSON.stringify(response));
                localStorage.removeItem("refreshing");
                localStorage.setItem(
                  "minTokenRefresh",
                  (new Date().getTime() + 500000).toString()
                );
              },
              (err) => {
                localStorage.removeItem("refreshing");
                localStorage.clear();
                location.reload();
              }
            );
          }
        }
      }, 3000);
    }
  }
}

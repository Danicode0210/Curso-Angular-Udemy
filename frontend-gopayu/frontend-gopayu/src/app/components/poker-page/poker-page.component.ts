import { MenuBalanceComponent } from './../shared/menu/menu-balance/menu-balance.component';
import { Component, OnInit } from "@angular/core";
import { MatSnackBar, MatDialog } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

import { Store } from "@ngrx/store";

import * as moment from "moment";

import { Subscription } from "rxjs";

import { AppState } from "../../app.state";
import { AssetsService } from "../../services/assets.service";
import { LoginService } from "../../services/login.service";
import { MenuService } from "../../services/menu.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-poker-page",
  templateUrl: "./poker-page.component.html",
  styleUrls: ["./poker-page.component.styl"],
})
export class PokerPageComponent implements OnInit {
  public image: any;
  public isAuth: boolean = false;
  public balanceBet: number = 0;
  public balancePoker: number = 0;
  public showModal: boolean = false;
  public gameUrl;
  public sessionTimer;
  public urlPoker: string = "";
  public i18n;
  public assetsSubscription: Subscription;
  public texts$;
  public pokerActive: boolean = true;
  public cajero: boolean = true;
  public isSafari: boolean = false;
  public isLoading: boolean = false;
  public iframe: boolean = false;

  constructor(
    private serviceHome: MenuService,
    private service: AssetsService,
    private serviceLogin: LoginService,
    private sanitizer: DomSanitizer,
    private snack: MatSnackBar,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit() {
    if (localStorage.getItem("session")) {
      this.isAuth = true;
      this.getBalance();
      this.getPokerBalance();
    }
    this.getPokerUrl();
    this.getBanner();

    this.isSafari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;

    this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.texts$ = assets.texts;
        this.i18n = assets.i18n;
        if (this.i18n.Poker) {
          this.pokerActive = this.i18n.Poker.isActived;
          this.cajero = this.i18n.Poker.cajero;
          
          this.iframe = this.i18n.Poker.iframe;

          if (!this.pokerActive) {
            this.router.navigate(["/"]);
          }

          if(!this.iframe)
          {
            this.getSession();
          }
        }
      });
  }

  getPokerUrl() {
    this.service.getPokerUrl().subscribe((response) => {
      if (response) {
        var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
        let urls = response["url"].split('|');
        if(isMac)
        {
          this.urlPoker = urls[1];
        }
        else
        {
          this.urlPoker = urls[0];
        }
      }
    });
  }

  getBanner() {
    this.service.getPokerBanner().subscribe((response) => {
      this.image = response[0];
    });
  }

  getBalance() {
    let session: any = JSON.parse(localStorage.getItem("session"));
    this.serviceLogin.getBalance(session.accessToken).subscribe((response) => {
      this.balanceBet = response["body"]["realBalance"];
    });
  }

  getPokerBalance() {
    let profile: any = JSON.parse(localStorage.getItem("profile"));
    this.serviceHome
      .validateUserPoker({
        userId: profile.accountCode,
      })
      .subscribe((response) => {
        this.balancePoker = response["balance"];
      });
  }

  getSession() {
    if (!this.isAuth) {
      return false;
    }
    let profile: any = JSON.parse(localStorage.getItem("profile"));
    this.isLoading = true;
    this.serviceHome
      .createSessionPoker({
        userId: profile.accountCode,
      })
      .subscribe((response) => {
        
        this.isLoading = false;

        this.gameUrl =
          environment.pokerURL +
          `?username=${profile.username}&token=${response["url"]}`;

        this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.gameUrl
        );

        var eventTime = 0;
        var currentTime = 0;
        var diffTime = eventTime + currentTime;
        var duration: any = moment.duration(diffTime * 1000, "milliseconds");
        var interval = 1000;

        setInterval(() => {
          duration = moment.duration(duration + interval, "milliseconds");
          this.sessionTimer =
            this.pad(duration.hours(), 2) +
            ":" +
            this.pad(duration.minutes(), 2) +
            ":" +
            this.pad(duration.seconds(), 2);
        }, interval);
      },
      err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  updateBalances() {
    this.getBalance();
    this.getPokerBalance();
  }

  numberFormatUI(field) {
    var num = field.toString().replace(/\./g, "");

    if (!isNaN(num)) {
      num = num
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
      num = num.split("").reverse().join("").replace(/^[\.]/, "");
      return num;
    } else {
      return field.toString().replace(/[^\d\.]*/g, "");
    }
  }
  launchPoker() {
    this.gaEventPokerOptions('Juega Ya');
    if (this.isAuth) {
      this.getSession();
    } else {
      this.snack.open("Debes ingresar a tu cuenta", "Cerrar", {
        duration: 3000,
      });
    }
  }

  pad(_number: number, zeros: number) {
    return "0".repeat(zeros).substr(_number.toString().length) + _number;
  }

  gaEventPoker(buttonLabel: string, showModal: boolean): void {
    if (showModal) {
      this.showModal = true;
    }
    const event = {
      event: 'ga_event',
      category: 'Poker',
      action: 'BPW - ' + buttonLabel,
      label: 'Ir a - ' + buttonLabel
    };
    window.dataLayer.push(event);
  }

  gaEventPokerBanner(banner: any): void {
    const event = {
      event: 'ga_event',
      category: 'Poker',
      action: 'BPW - ' + banner.link,
      label: 'Banner'
    };
    window.dataLayer.push(event);
  }

  gaEventPokerOptions(buttonLabel: string): void {
    const event = {
      event: 'ga_event',
      category: 'Poker',
      action: 'BPW - ' + buttonLabel,
      label: buttonLabel
    };
    window.dataLayer.push(event);
  }

  gaEventSeePokerBanner(): void {
    const event = {
      event: 'ga_event',
      category: 'Poker',
      action: 'BPW - Banner Principal',
      label: 'Ver - Juega Poker'
    };
    window.dataLayer.push(event);
  }
}

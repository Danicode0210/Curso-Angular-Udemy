import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { BetsService } from '../../services/bets.service';
import { environment } from '../../../environments/environment';

declare global {
  interface Window { _kc: any; }
}

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: []
})
export class BetsComponent implements OnInit {

  private isBrowser: boolean;
  private isMobile;
  public isLoading:boolean = true;

  constructor(private service: BetsService,
    private route:ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.title.setTitle("Apuestas Deportivas en Vivo ® BetPlay 【 2020 】");
    this.meta.updateTag({
      name: 'description',
      content: 'Las mejores competiciones del mundo: Liga BetPlay Colombiana, Copa BetPlay, Torneo BetPlay, La Liga Española, Premier League, Calcio Serie A Liga Italiana, Bundesliga Alemana, Liga Argentina, Champions League, Copa Sudamericana, Copa Libertadores, Copa del Rey, Liga Championship, FA Cup, Copa Italiana, Copa Alemana, Copa de Francia.'
    });

    if (this.isBrowser) {
      this.isMobile = {
        Android: () => {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: () => {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: () => {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: () => {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: () => {
          return navigator.userAgent.match(/IEMobile/i);
        }
      };

      this.isMobile.any = () => {
          return (this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows());
      }

      if(this.isMobile.any())
      {
          require('../../../assets/js/kambi-mobile.js');
      }
      else
      {
          require('../../../assets/js/kambi-desktop.js');
      }
    }
  }

  ngOnInit() {

    if (this.isBrowser) {
      let header = document.getElementById('header');
      header.classList.remove("sticky");

      if(document.getElementsByTagName('base')[0]){
        document.getElementsByTagName('base')[0].href = '';
      }

      if(this.route.routeConfig.path == "live")
      {
          window.location.href = '/live#filter/all/all/all/all/in-play'
      }
      else
      {
        if(this.route.routeConfig.path == "mis-apuestas")
        {
          window.location.href = '/mis-apuestas#bethistory'
        }
        else
        {
          if(window.location.href.indexOf('filter') == -1 && window.location.href.indexOf('bonus-offers') == -1)
          {
            window.location.href = '/apuestas#home'
          }
        }
      }
      this.isMobile = {
        Android: () => {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: () => {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: () => {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: () => {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: () => {
          return navigator.userAgent.match(/IEMobile/i);
        }
      };

      this.isMobile.any = () => {
          return (this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows());
      }

      if(this.isMobile.any())
      {
          require('../../../assets/js/kambi-mobile.js');
      }
      else
      {
          require('../../../assets/js/kambi-desktop.js');
      }

      if(localStorage.getItem("session"))
      {
        if(!localStorage.getItem("kambiToken") || (!localStorage.getItem('kambiTokenNextUpdate') || (parseInt(localStorage.getItem('kambiTokenNextUpdate')) < new Date().getTime() && !window['_kc'])))
        {
          this.getKambiToken();
        }
        else
        {
          if(!window['_kc'])
          {
            this.initKambi();
          }

          this.isLoading = false;
        }
      }
      else
      {
        if(!window['_kc'])
        {
          this.initKambi();
        }
        this.isLoading = false;
      }
    }

  }

  getKambiToken() {
    this.service.getKambiToken()
      .subscribe((response: any) => {
        if (response.ticket) {
          var profile = JSON.parse(localStorage.getItem('profile'));
          localStorage.setItem('kambiTokenNextUpdate',(new Date().getTime()+45000000).toString());
          localStorage.setItem("kambiToken", response.ticket);
          localStorage.setItem("playerId", profile.accountId);
        }
        this.initKambi();
      },
      () => {
        this.initKambi();
      });
  }

  initKambi() {
    var stateAuth = "false";

    if (localStorage.getItem("kambiToken")) {
      stateAuth = "true";
    }

    if (environment.ENVIROMENT == 'PRODUCTION')
    {
      document.cookie = document.cookie + '; token=' + localStorage.getItem("kambiToken") + ';secure';
      document.cookie = document.cookie + '; playerId=' + localStorage.getItem("playerId") + ';secure';
    }
    else
    {
      document.cookie = document.cookie + '; token=' + localStorage.getItem("kambiToken") + ';';
      document.cookie = document.cookie + '; playerId=' + localStorage.getItem("playerId") + ';';
    }

    window._kc = {
      currency: 'COP',
      playerId: localStorage.getItem("playerId") || "",
      customerData: '',
      ticket: localStorage.getItem("kambiToken") || "",
      locale: 'es_ES',
      market: 'CO',
      streamingAllowedForPlayer: 'true',
      oddsFormat: 'decimal',
      racingMode: 'false',
      enablePush: 'true',
      showPushStatus: 'true',
      auth: stateAuth
    };

    let ckeditor = document.createElement('script');
    let kambiUrl = environment.kambiUrl;
    ckeditor.setAttribute('src', kambiUrl + (new Date()).getTime());
    document.head.appendChild(ckeditor);

    // setInterval(function(){
    //   if(window['_kbc'])
    //   {
    //     delete(window['_kbc'].fogglesSettings.account.links.bethistory)
    //     clearInterval(this);
    //   }
    // });

    setTimeout(() => {
        this.isLoading = false;
    },2000);
  }

}

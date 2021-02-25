import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit,Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute} from "@angular/router"
import { SlotsService} from '../../../services/slots.service'
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment'

@Component({
  selector: 'app-launcher',
  templateUrl: './launcher.component.html',
  styleUrls: []
})
export class LauncherComponent implements OnInit {
  private isBrowser:boolean;
  private _GET:any;
  public isLoading:Boolean = true;
  public gameUrl;
  public sessionTimer;
  public wrapperPointer: boolean = false;
  public isAuth: boolean;
  public bonus: 0;
  public integrationChannelCode;
  public zoomIn:boolean = true
  
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
      private snackBar:MatSnackBar,
      private servie:SlotsService,
      private sanitizer: DomSanitizer,
      private activatedRoute: ActivatedRoute
  ) {
      this.isBrowser = isPlatformBrowser(platformId);
      this.activatedRoute.queryParams.subscribe(params => {
        const gameName = params.gameName;
        const searchTerm = params.searchTerm;
        this.gaEventSearch(gameName, searchTerm);
      });
      if(this.isBrowser)
      {
        if(localStorage.getItem('session'))
        { 
          this.isAuth = true;

          this.activatedRoute.queryParams.subscribe(params => {
              this._GET = params;
              this.launchGame(this._GET);
          });
        }
        else 
        {
          this.snackBar.open("Debes iniciar sesión", "Cerrar");
          setTimeout(() => {
            window.location.href = '/';
          },3000);
        }  
      }
  }

  ngOnInit() {
    let bonus:any = JSON.parse(localStorage.getItem("bonuses"));

    for(var i = 0; i < bonus.length; i++)
    {
      if(bonus[i].status == 'Active')
      {
        this.bonus = bonus[i].bonusBalance;
      } 
    }
  }

  gaEventSearch(search: string, searchTerm: string): void {
    const event = {
      event: 'ga_event',
      category: 'Header',
      action: 'BPW - Buscador',
      label: search,
      terminoBusquedasPrincipales: searchTerm
    };
    window.dataLayer.push(event);
  }

  launchGame(_data)
  {   
      this.integrationChannelCode = _data.integrationChannelCode;
      if(_data.integrationChannelCode == 'QUICKFIRE')
      {
        _data = {
          "integrationChannelCode": _data.integrationChannelCode,
          "gameCode": _data.gameCode,
          "quickfireParameters": {
            "additionalParam": _data.additionalParam
          },
          "flashClient": false
        };
      }
      else
      {
        _data = {
          "integrationChannelCode": _data.integrationChannelCode,
          "gameCode":  _data.gameCode
        };
      }

      this.servie.launchGame(_data)
      .subscribe((response:any) => {
          this.isLoading = false;
          this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.url);
          var eventTime= 0;
          var currentTime = 0;
          var diffTime = eventTime + currentTime;
          var duration:any = moment.duration(diffTime*1000, 'milliseconds');
          var interval = 1000;

          setInterval(() => {
            duration = moment.duration(duration + interval, 'milliseconds');
            this.sessionTimer = this.pad(duration.hours(),2) + ":" + this.pad(duration.minutes(),2) + ":" + this.pad(duration.seconds(), 2);
          }, interval);
          //window.location = response.url;
          //window.open(response.url);
      },
      () => {
          this.isLoading = false;
          this.snackBar.open("Hubo un error al lanzar el juego, por favor intentalo de nuevo", "Cerrar");
          setTimeout(() => {
            window.close();
          },3000);
      }
      );
  }

  pad(_number:number, zeros:number){
    return "0".repeat(zeros).substr(_number.toString().length) + _number;
  }

}

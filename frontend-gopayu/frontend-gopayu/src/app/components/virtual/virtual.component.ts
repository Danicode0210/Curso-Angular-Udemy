import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SlotsService } from './../../services/slots.service';
import { VirtualService } from './../../services/virtual.service';
import { AppState } from './../../app.state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-virtual',
  templateUrl: './virtual.component.html',
  styleUrls: ['./virtual.component.styl']
})
export class VirtualComponent implements OnInit {

  public i18n;
  public assetsSubscription: Subscription;
  public virtualesActive:boolean = true;
  public games:any = [];
  public base_url:string = '';
  public isLoading:Boolean = false;
  public gameUrl;
  public sessionTimer;
  public wrapperPointer: boolean = false;
  public isAuth: boolean;
  public zoomIn:boolean = true

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private service:VirtualService,
    private snackBar:MatSnackBar,
    private sanitizer: DomSanitizer,
    private slotsService:SlotsService
  ) { 

    this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.i18n = assets.i18n;
       
        if (this.i18n.Poker) {
          this.virtualesActive = this.i18n.Virtuales.isActived;
        }
        if (!this.virtualesActive) {
          this.router.navigate(["/"]);
        }
      });

  }

  ngOnInit() {
    this.getGames();
  }

  reloadPage(){
    location.reload();
  }


  launchGame(gameCode)
  { 

    if(!localStorage.getItem('session'))
    { 
      this.snackBar.open("Debes iniciar sesión", "Cerrar");
      return false;
    }
        
    var _data = {
      "integrationChannelCode": 'Patagonia',
      "gameCode":  'ki-virtualSport'
    };

    this.isLoading = true;

    this.slotsService.launchGame(_data)
    .subscribe((response:any) => {
        this.isLoading = false;
        this.gameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.url+'&serviceMessage='+gameCode+'&s=style25');
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

  getGames(){
    this.service.getGames()
    .subscribe(response => {
      this.games = response['games'];
      this.base_url = response['base_url'];

      // for(var i = 0; i < this.games.length; i++)
      // {
      //   this.games[i].image = this.sanitizer.bypassSecurityTrustStyle(this.base_url+this.games[i].image);
      // }

      setTimeout(() => {
        var items = document.querySelectorAll('.virutal-wrapper');

        for(var i = 0; i < items.length; i++){
          items[i]['style'] = "background-image:url('"+items[i].id+"')"
        }
      });
    });
  }

  pad(_number:number, zeros:number){
    return "0".repeat(zeros).substr(_number.toString().length) + _number;
  }

}

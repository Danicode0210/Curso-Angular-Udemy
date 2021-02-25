import { AppState } from './../../app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AssetsService } from './../../services/assets.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-smartbanner',
  templateUrl: './smartbanner.component.html',
  styleUrls: ['./smartbanner.component.styl']
})
export class SmartbannerComponent implements OnInit {

  @Output()
  private close = new EventEmitter();
  public logo:string = require('../../../assets/img/header/logo-smartbanner.png');
  public assets: any;
  public assetsSubscription: Subscription;
  
  constructor(private service:AssetsService,
    private store:Store<AppState>, 
    ) { }

  ngOnInit() {
    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.assets = assets;
    });
  }

  closeSmartBanner()
  {
    // localStorage.setItem('smartBannerClose', new Date(new Date().getTime()+100000000).toString());
    this.close.emit();
  }

  downloadAPK()
  {
    this.service.getActiveAPK()
    .subscribe(response => {
      if(response['data'].length > 0)
      {
        let apk = response['data'][0];
        window.location.href = response['url']+apk.path;
        this.closeSmartBanner();
        window['$']('#modal-download').modal('show');
      }
    })
  }
}

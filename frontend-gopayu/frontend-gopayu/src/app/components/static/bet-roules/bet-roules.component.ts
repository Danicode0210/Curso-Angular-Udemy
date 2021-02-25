import { AppState } from './../../../app.state';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-bet-roules',
  templateUrl: './bet-roules.component.html',
  styleUrls: []
})
export class BetRoulesComponent implements OnInit {

  public assetsSubscription: Subscription;
  public betRoules = { path:'/pdf/Kambi_Operator_Spanish.pdf', name:'Kambi Operator T&amp;C v1.6 – Spanish'};
  constructor(private store:Store<AppState>) { }

  ngOnInit() {
    if(localStorage.getItem('files'))
    { 
      let pdfs = JSON.parse(localStorage.getItem('files'));
      let KambiRoules = pdfs.find(roule => roule.fileCode === 'KAMBI_ROULES');
      if(KambiRoules)
      {
        this.betRoules = KambiRoules;
      }
    }
    else 
    {
      this.assetsSubscription = this.store.select('assets').subscribe( assets => {
        let pdfs:any = assets.files;
        let KambiRoules = pdfs.find(roule => roule.fileCode === 'KAMBI_ROULES');
        if(KambiRoules)
        {
          this.betRoules = KambiRoules;
        }
      });
    }
  }

}

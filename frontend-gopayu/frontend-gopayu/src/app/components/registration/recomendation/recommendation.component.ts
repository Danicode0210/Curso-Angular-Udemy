import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';


@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.styl']
})
export class RecommendationComponent implements OnInit {

  public assets: any;
  public assetsSubscription: Subscription;

  constructor(private dialogRef:MatDialogRef<RecommendationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private store:Store<AppState>, 
    ) {
  }

  closeModal() {
    this.gaEventRegisterPopUpError();
    this.dialogRef.close();
  }

  ngOnInit() {
    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.assets = assets;
    });
  }

  gaEventRegisterPopUpError() {
    const event = {
      'event':'ga_event',
      'category':'Registro',
      'action':'BPW - Popup error',
      'label':'Aceptar - ' + this.data.content
    };
    window.dataLayer.push(event);
  }

}

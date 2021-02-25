import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

@Component({
  selector: 'app-limits-modal',
  templateUrl: './limits-modal.component.html',
  styleUrls: ['./limits-modal.component.styl']
})
export class LimitsModalComponent implements OnInit {

  public assets: any;
  public assetsSubscription: Subscription;

  constructor(
    private dialogRef:MatDialogRef<LimitsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store:Store<AppState>, 
  ) { 
  }

  closeModal() {
    this.gaEventRegisterLimits();
    this.dialogRef.close();
  }

  ngOnInit() {
    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.assets = assets;
    });
  }

  gaEventRegisterLimits() {
    const event = {
      'event':'ga_event',
      'category':'Registro',
      'action':'BPW - consultar limites',
      'label':'Aceptar'
    };
    window.dataLayer.push(event);
  }

}

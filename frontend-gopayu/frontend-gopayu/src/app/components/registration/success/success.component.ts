import { AppState } from './../../../app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styles: []
})
export class SuccessComponent implements OnInit {

  public assetsSubscription: Subscription;
  /* Get tetxs */
  public texts$;
  public localTexts$;
  public textBotonVolver = 'Volver';
  constructor(
    private store: Store<AppState>,
  ) {

    this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.texts$ = assets.texts;
        this.localTexts$ = assets.localTexts;
      });
   }

   gaEventRegisterSuccessBack() {
    const event = {
      event: 'ga_event',
      category: 'Registro',
      action: 'BPW - Confirmacion',
      label: this.textBotonVolver
    };
    window.dataLayer.push(event);
  }

  ngOnInit() {
  }

}

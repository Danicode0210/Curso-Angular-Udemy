import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './../../../app.state';

@Component({
  selector: 'app-accept-terms',
  templateUrl: './accept-terms.component.html',
  styleUrls: ['./accept-terms.component.styl']
})
export class AcceptTermsComponent implements OnInit {

  public texts$;
  public localTexts$;
  public assetsSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.texts$ = assets.texts;
      this.localTexts$ = assets.i18n;
    });
  }

}

import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from "@angular/router";

import { Store } from "@ngrx/store";

import { Subscription } from "rxjs";

import { AppState } from "../app.state";

@Injectable()
export class PokerGuardService implements CanActivate {
  public i18n;
  public assetsSubscription: Subscription;
  public texts$;
  public pokerActive: boolean = true;

  constructor(private router: Router, private store: Store<AppState>) {
    this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.texts$ = assets.texts;
        this.i18n = assets.i18n;
        if (this.i18n.Poker && this.i18n.Poker.isActived == "active") {
          this.pokerActive = this.i18n.Poker.isActived;
          if (!this.i18n.Poker.isActived) {
            this.router.navigate(["/"]);
          }
        }
      });
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /* Validate session and route to redirect or stay */
    if (!this.pokerActive) {
      this.router.navigate(["/"]);
      /* Stay */
      return false;
    } else {
      return true;
    }
  }
}

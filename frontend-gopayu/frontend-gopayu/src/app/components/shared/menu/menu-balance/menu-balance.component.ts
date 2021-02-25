import { MatDialogRef } from '@angular/material';
import { AppState } from './../../../../app.state';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuService } from 'src/app/services/menu.service';
import * as moment from 'moment'

@Component({
  selector: 'app-menu-balance',
  templateUrl: './menu-balance.component.html',
  styleUrls: []
})
export class MenuBalanceComponent implements OnInit {

  public isLoading:boolean = true;
  public balance:any = [];
  public bonuses:any = [];
  public texts$;
  public assetsSubscription: Subscription;
  public screen:number = 0;
  public bonusNotifications:number = 0;
  public textBotonClose = 'Cerrar';

  constructor(private service:MenuService, private store:Store<AppState>, private dialogRef:MatDialogRef<MenuBalanceComponent>) {
      /* get balance */
      this.balance = JSON.parse(localStorage.getItem("balance"));
      this.balance.bonosPendientes = (this.balance.bonosPendientes) ? this.balance.bonosPendientes : 0;

      this.assetsSubscription = this.store.select('assets').subscribe( assets => {
        this.texts$ = assets.texts;
      });
  }

  ngOnInit() {
    this.getBonuses();
    this.getBalance();
  }

  getBalance()
  {
    this.service.getBalance()
    .subscribe(response => {
      localStorage.setItem('balance', JSON.stringify(response));
      localStorage.setItem('balanceLetUpdate', (new Date().getTime() + 120000).toString());
      /* get balance */
      this.balance = JSON.parse(localStorage.getItem("balance"));
      this.balance.bonosPendientes = (this.balance.bonosPendientes) ? this.balance.bonosPendientes : 0;
    },
    () => {
    })

  }

  getBonuses()
  {
    this.service.getBonuses()
    .subscribe((response) => {
        this.bonuses = response;

        for(let i = 0; i < this.bonuses.length; i++){
          if(this.bonuses[i].status == 'Active') {
            this.screen = 1
          }
        }

        localStorage.setItem('bonuses', JSON.stringify(response));
        this.balance.bonosPendientes = (this.balance.bonosPendientes) ? this.balance.bonosPendientes : 0;

        this.isLoading = false;
    },() => {
        this.isLoading = false;
    });
  }

  gaEventCloseBalance() {
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Saldo',
      label: this.textBotonClose
    };
    window.dataLayer.push(event);
  }

  closeModal()
  {
    this.gaEventCloseBalance();
    this.dialogRef.close();
  }
}

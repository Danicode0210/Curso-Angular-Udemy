import { MenuResponsableGameComponent } from './menu-responsable-game/menu-responsable-game.component';
import { MenuProfileComponent } from './menu-profile/menu-profile.component';
import { MenuHistoryComponent } from './menu-history/menu-history.component';
import { MenuBalanceComponent } from './menu-balance/menu-balance.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MenuDepositsComponent } from './menu-deposits/menu-deposits.component';
import { MenuWithdrawalsComponent } from './menu-withdrawals/menu-withdrawals.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent implements OnInit {

  private modals:Array<any> = new Array();

  constructor(
    public dialog: MatDialog,
  ) { 
    this.modals['DEPOSITS'] = MenuDepositsComponent;
    this.modals['WITHDRAWALS'] = MenuWithdrawalsComponent;
    this.modals['BALANCE'] = MenuBalanceComponent;
    this.modals['HISTORY'] = MenuHistoryComponent;
    this.modals['PROFILE'] = MenuProfileComponent;
    this.modals['RESPONSABLE_GAME'] = MenuResponsableGameComponent;
  }

  ngOnInit() {

  }

  gaEventProfileMenu(section: string): void {
    let menuItem = '';
    if (section === 'DEPOSITS') {
      menuItem = 'Metodos De Recarga';
    } else if (section === 'WITHDRAWALS') {
      menuItem = 'Retirar Saldo';
    } else if (section === 'BALANCE') {
      menuItem = 'Balance';
    } else if (section === 'HISTORY') {
      menuItem = 'Historial';
    } else if (section === 'PROFILE') {
      menuItem = 'Mi Cuenta';
    } else if (section === 'RESPONSABLE_GAME') {
      menuItem = 'Juego responsable';
    } 

    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Menú',
      label: 'Submenú - ' + menuItem
    };
    window.dataLayer.push(event);
  }

  OpenModal(_modal){
    this.gaEventProfileMenu(_modal);
    this.dialog.open(this.modals[_modal], {
      panelClass:'menu-dialog'
    });
  }

}

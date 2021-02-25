import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-responsable-game',
  templateUrl: './menu-responsable-game.component.html',
  styleUrls: []
})
export class MenuResponsableGameComponent implements OnInit {

  public type:number = 0;
  public textBotonAutoLimites = 'Auto Limites';
  public textBotonAutoExclusion = 'Auto Exclusion';
  public textBotonLimiteDeSesion = 'Limite De Sesion';
  
  constructor(private dialogRef:MatDialogRef<MenuResponsableGameComponent>) { }

  ngOnInit() {
  }

  
  onClickButtonResponsableGame(clickEvent: any): void {
    const buttonId = clickEvent.target.attributes.id.nodeValue;
    if (buttonId === 'button1') {
      this.type = 1;
      this.gaEventResponsableGame(this.textBotonAutoLimites);
    } else if (buttonId === 'button2') {
      this.type = 2;
      this.gaEventResponsableGame(this.textBotonAutoExclusion);
    } else if (buttonId === 'button3') {
      this.type = 3;
      this.gaEventResponsableGame(this.textBotonLimiteDeSesion);
    }
  }

  gaEventResponsableGame(buttonLabel: string): void {
    const event = {
      event: 'ga_event',
      category: 'Mi Cuenta',
      action: 'BPW - Juego responsable',
      label: buttonLabel
    };
    window.dataLayer.push(event);
  }

  closeModal()
  {
      this.dialogRef.close();
  }
}

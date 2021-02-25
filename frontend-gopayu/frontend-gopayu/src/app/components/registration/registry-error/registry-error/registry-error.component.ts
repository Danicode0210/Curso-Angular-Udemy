import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-registry-error',
  templateUrl: './registry-error.component.html',
  styleUrls: ['./registry-error.component.styl']
})
export class RegistryErrorComponent implements OnInit {

  public isLiveChat = true;

  constructor(
    private dialogRef:MatDialogRef<RegistryErrorComponent>
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }

  toggleChat() {
    console.log('me llamaron');
    if(!this.isLiveChat)
    {
      let button:any = document.querySelector('.chattigo-widget-trigger');
      button.click();
      this.closeModal();
    }
    else 
    {
      document.getElementById("chat-button").click();
      this.closeModal();
    }
  }

  toggleWeCallYou() {
    window['$']('#callbackCB').removeClass('d-none');
    this.closeModal();
  }
}

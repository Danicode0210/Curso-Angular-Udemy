import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-repeated-phone-number',
  templateUrl: './repeated-phone-number.component.html',
  styleUrls: ['./repeated-phone-number.component.styl']
})
export class RepeatedPhoneNumberComponent implements OnInit {

  public isLiveChat = true;

  constructor(
    private dialogRef:MatDialogRef<RepeatedPhoneNumberComponent>
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
    const doc = document.querySelector('.content_callback') as HTMLElement;
    doc.style.zIndex = '100000';
    this.closeModal();
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-pop-up-error',
  templateUrl: './pop-up-error.component.html',
  styleUrls: ['./pop-up-error.component.styl']
})
export class PopUpErrorComponent implements OnInit {

  public isLiveChat = true;
  public message = '';
  public title = '';

  constructor(
    private dialogRef:MatDialogRef<PopUpErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message;
    this.title = data.title;
   }

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

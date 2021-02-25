import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: []
})
export class ShareComponent implements OnInit {

  public url;
  public text;

  constructor(public dialogRef: MatDialogRef<ShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,private sanitizer:DomSanitizer) {
    
      this.url = location.href;
      this.text = this.data.short_desc;
   }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

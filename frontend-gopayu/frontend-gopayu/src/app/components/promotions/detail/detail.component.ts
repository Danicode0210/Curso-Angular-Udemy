import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: []
})
export class DetailComponent {
  public detail:any; 
  constructor(public dialogRef: MatDialogRef<DetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {html:string, title:string, date:string}) { 
                this.detail = data;
              }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

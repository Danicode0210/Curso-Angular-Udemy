import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-update-popup',
  templateUrl: './update-popup.component.html',
  styleUrls: []
})
export class UpdatePopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UpdatePopupComponent>) { }

  ngOnInit() {
  }

  closeModal(selection)
  {
    localStorage.setItem('minUpdateModal',(new Date().getTime()+31500000000).toString());
    this.dialogRef.close(selection);
  }
} 

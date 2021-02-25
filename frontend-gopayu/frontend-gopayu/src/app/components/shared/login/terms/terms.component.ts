import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: []
})
export class TermsComponent {

  public url:any ;

  constructor(
    public dialogRef: MatDialogRef<TermsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {url:string}, public sanitizer: DomSanitizer) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
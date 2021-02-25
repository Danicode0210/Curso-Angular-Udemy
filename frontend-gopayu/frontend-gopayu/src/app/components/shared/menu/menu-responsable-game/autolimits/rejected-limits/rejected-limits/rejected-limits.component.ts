import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuService } from 'src/app/services/menu.service';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-rejected-limits',
  templateUrl: './rejected-limits.component.html',
  styleUrls: ['./rejected-limits.component.styl']
})
export class RejectedLimitsComponent implements OnInit {

  public rejectedLimits = [];
  public tipoLimites = {
    DIARIO: 'Limite Diario',
    MENSUAL: 'Limite Mensual',
    SEMANAL: 'Limite Semanal'
  };
  constructor(
    private dialogRef: MatDialogRef<RejectedLimitsComponent>,
    private service: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.rejectedLimits = this.data.rejectedLimits;
      dialogRef.disableClose = true;
   }

  ngOnInit() {
  }

  numberFormat(field) {
    let num = field;
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        return num;
    }
  }

  dateFormat(date) {
    const dateTime = date.split('T')[0];
    return dateTime;
  }

  rejectLimits(): void {
    this.service.acceptOrRefuseAutolimits(this.data.rejectedLimits, 0).subscribe(
      (data) => {
        this.dialogRef.close();
      }
    );

  }
}

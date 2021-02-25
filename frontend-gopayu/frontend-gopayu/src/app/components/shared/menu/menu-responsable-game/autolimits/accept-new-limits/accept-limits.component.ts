import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-accept-limits',
  templateUrl: './accept-limits.component.html',
  styleUrls: ['./accept-limits.component.styl']
})
export class AcceptLimitsComponent implements OnInit {

  public message = '';
  public limitsRequests: [];
  public tipoLimites = {
    DIARIO: 'Limite Diario',
    MENSUAL: 'Limite Mensual',
    SEMANAL: 'Limite Semanal'
  };
  constructor(
    private dialogRef: MatDialogRef<AcceptLimitsComponent>,
    private service: MenuService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.limitsRequests = this.data.newLimits;
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  acceptNewLimits(): void {
    this.service.acceptOrRefuseAutolimits(this.data.newLimits, 1).subscribe(
      (data) => {
        this.dialogRef.close({acceptedLimits: true});
      }
    );
  }

  declineNewLimits(): void {
    this.service.acceptOrRefuseAutolimits(this.data.newLimits, 0).subscribe(
      (data) => {
        this.dialogRef.close({acceptedLimits: false});
      }
    );
  }

  numberFormat(field) {
      let num = field;
      if (!isNaN(num)) {
          num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
          num = num.split('').reverse().join('').replace(/^[\.]/,'');
          return num;
      }
  }
}

import { MenuService } from 'src/app/services/menu.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promotionalmodal',
  templateUrl: './promotionalmodal.component.html',
  styleUrls: ['./promotionalmodal.component.styl']
})
export class PromotionalmodalComponent implements OnInit {

  public formData: FormGroup;
  public successMessage:string = "";
  public requestSuccess: Boolean = false;
  public error: String = '';
  public isLoading: Boolean = false;
  public isSubmited:boolean = false;
  public name:String = '';

  constructor(private dialogRef:MatDialogRef<PromotionalmodalComponent>, private service:MenuService) { 

    /* Save form */
    this.formData = new FormGroup({
      cuponCode: new FormControl('', [
        Validators.required
      ])
    });

  }

  ngOnInit() {
  }
  close()
  {
    this.dialogRef.close();
  }

  validateCupon()
  { 
    this.error = '';
    this.isSubmited = true;
    if(this.formData.status === 'VALID')
    {
        this.isLoading = true;

        let profile = JSON.parse(localStorage.getItem("profile"));

        let dataSend = {
          "docNumber": profile.identityDocument.number,
          "id_player": profile.accountId,
          "id_bono": this.formData.value['cuponCode'],
          "registerDate": profile.registerDate
        }

        this.name = profile.firstName;

        this.service.validateCupon(dataSend)
        .subscribe((response:any) => {
          this.isLoading = false;
          this.requestSuccess = true;
        },
        (err) => {
          let errors = new Array();
          errors[401] = {
            message:"Error al validar"
          }
          errors[402] = {
            message:"No se encontró ningún bono con el código ingresado"
          }
          errors[403] = {
            message:"El bono ya fue redimido"
          }
          errors[404] = {
            message:"El bono ingresado no se encuentra activo"
          }
          errors[405] = {
            message:"El bono ingresado se encuentra vencido"
          }
          errors[411] = {
            message:"Tipo de cliente no válido"
          }
          errors[410] = {
            message:"El bono ha superado el límite de redenciones"
          }
          this.isLoading = false;
          if(errors[err.status])
          {
            this.error = errors[err.status].message;
          }
          else 
          {
            this.error = 'Hubo un problema, por favor intenta de nuevo';
          }
        })
        
    }
  }
}

import { AppState } from './../../../../app.state';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DataPopupService } from "../../../../services/datapopup.service"
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: []
})
export class DataComponent {
  /* Get tetxs */
  private imageBase:any = '';
  private image2Base:any = '';
  public showErrorImage:boolean = false;
  public formData: FormGroup;
  public formError:string = '';
  public formSuccess:string = '';
  public isLoading:boolean = false;
  public assetsSubscription: Subscription;
  public texts: any;

  constructor(
    private store:Store<AppState>,
    public dialogRef: MatDialogRef<DataComponent>,
    private service:DataPopupService,
    @Inject(MAT_DIALOG_DATA) public data: {documentNumber:string, type:string}, public sanitizer: DomSanitizer
  ) {
     /* Save form */
     this.formData = new FormGroup({
      docNumber: new FormControl(this.data.documentNumber, [
        Validators.required
      ]),
      type: new FormControl(this.data.type, [
        Validators.required
      ]),
      profesion: new FormControl('', [
        Validators.required
      ]),
      other: new FormControl('', [
        Validators.required
      ]),
      peps: new FormControl('', [
        Validators.required
      ]),
      procedinero: new FormControl('', [
        Validators.required
      ])
    });

    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      this.texts = assets.texts;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  sendData(_file, _file2)
  {
    this.formError = '';

    if(this.formData.value.profesion.length == 0)
    {
        this.formError = "Selecciona una profesión";
    }
    if(this.formData.value.profesion == 'other' && this.formData.value.other.length == 0)
    {
        this.formError = "Debes ingresar tu profesión";
    }
    else if(this.formData.value.peps.length == 0)
    {
        this.formError = "Selecciona una si eres PEP's";
    }
    else if(this.formData.value.procedinero.length == 0 || !this.formData.value.procedinero)
    {
        this.formError = "Debes aceptar la procedencia de dineros";
    }
    else if(!_file)
    {
        this.formError = "Debes seleccionar los dos archivos";
    }
    else if(!_file2)
    {
        this.formError = "Debes seleccionar los dos archivos";
    }
    else
    {
        this.isLoading = true;

        var documentType = this.formData.value.type;

        if(documentType == 'C.C' || documentType == 1)
        {
          this.formData.patchValue({
            type:'ID'
          });
        }
        else if(documentType == 'C.E' || documentType == 4)
        {
          this.formData.patchValue({
            type:'RES'
          });
        }

        let dataForm = this.formData.value;

        if(dataForm.profesion == 'other') {
          dataForm.profesion = this.formData.value.other;
        }

        this.service.sendData(dataForm, _file['files'][0], _file2['files'][0])
        .subscribe((response:any) => {

          var today:any;
          today = new Date().setMonth(new Date().getMonth()+1);
          today = `${new Date(today).getMonth()}-${new Date(today).getDate()}-${new Date(today).getFullYear()}`;

          localStorage.setItem(`${this.formData.value.docNumber}-send-lastIsVip`, today);
          this.formSuccess = 'Tus datos han sido enviados correctamente, ya puedes iniciar sesión correctamente.';
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 2000);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        });
    }
  }
  resetInputFile(_event)
  {
    _event.target.value = '';
  }
  fileChange(_event)
  {
    this.showErrorImage = false;
    this.imageBase = '';
    var file = _event.target.files[0];

    if(file.type != 'image/jpeg')
    {
        this.resetInputFile(_event);
        this.showErrorImage = true;
    }
    else
    {
        var reader = new FileReader();
        reader.onload = (img:any) => {
            this.imageBase = reader.result;
            //this.formData.patchValue({fotocoCC:this.imageBase.replace('data:image/jpeg;base64,','')});
        };

        reader.readAsDataURL(file);
    }

  }

  file2Change(_event)
  {
    this.showErrorImage = false;
    this.image2Base = '';
    var file = _event.target.files[0];

    if(file.type != 'image/jpeg')
    {
        this.resetInputFile(_event);
        this.showErrorImage = true;
    }
    else
    {
        var reader = new FileReader();
        reader.onload = (img:any) => {
            this.image2Base = reader.result;
            //this.formData.patchValue({fotocoCC:this.imageBase.replace('data:image/jpeg;base64,','')});
        };

        reader.readAsDataURL(file);
    }
  }

  getImageBase()
  {
    return (this.imageBase != '') ? this.imageBase : false;
  }

  getImage2Base()
  {
    return (this.image2Base != '') ? this.image2Base : false;
  }

}

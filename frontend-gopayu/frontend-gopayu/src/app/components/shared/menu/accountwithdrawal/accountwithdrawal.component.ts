import { LoginService } from './../../../../services/login.service';
import { AppState } from './../../../../app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { AccountwithdrawalService } from './../../../../services/accountwithdrawal.service';
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
const uuid = require("uuid");

@Component({
  selector: "app-accountwithdrawal",
  templateUrl: "./accountwithdrawal.component.html",
  styleUrls: ["./accountwithdrawal.component.styl"],
})
export class AccountwithdrawalComponent implements OnInit {
  public formData: FormGroup;
  public formSuccess: string = "";
  public banks = [];
  public paymentMethods = [];
  public accountTypes = [];
  public isLoading: boolean = false;
  public success: string = "";
  public error: string = "";
  public isConfirm:boolean = false;
  public flagDoc:boolean = false;
  public assetsSubscription: Subscription;
  public formato:string = '';
  private formatImage: File;
  public localTexts$;
  public minVal:Number = 100000;
  public maxVal:Number = 1500000;


  @Output()
  public hideSelect = new EventEmitter<any>();

  constructor(private serviceLogin:LoginService, private service: AccountwithdrawalService, private dialogRef:MatDialogRef<AccountwithdrawalComponent>, private store:Store<AppState>,) {
    this.formData = new FormGroup({
      accountNumber: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(17),  Validators.pattern(/^[-+]?[0-9]+$/)]),
      bankCode: new FormControl("", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      accountType: new FormControl("", [Validators.required]),
      paymentMethod: new FormControl("251", [Validators.required]),
      externalUID: new FormControl(uuid.v1(), [Validators.required]),
      valorRetencion: new FormControl(0, [Validators.required]),
      valoraRetirar: new FormControl(0, [Validators.required]),
      formulario: new FormControl('',[])
    });
  }

  ngOnInit() {
    this.getResources();

    this.assetsSubscription = this.store.select('assets').subscribe( assets => {
      
      this.localTexts$ = assets.i18n;

      let pdfs:any = assets.files;

      for (const file in pdfs) {
        if (pdfs[file]['fileCode'] == "FORMATO_RETENCION") {
          this.formato = pdfs[file]['path'];
        }
      }

      if(this.localTexts$['AccountWithdrawal'])
      {
        this.minVal = this.localTexts$['AccountWithdrawal']['minVal'];
        this.maxVal = this.localTexts$['AccountWithdrawal']['maxVal'];
      }

    });

    
  }

  numberFormatUI(field) {
    var num = field.toString().replace(/\./g, "");

    if (!isNaN(num)) {
      num = num
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
      num = num.split("").reverse().join("").replace(/^[\.]/, "");
      return num;
    } else {
      return field.toString().replace(/[^\d\.]*/g, "");
    }
  }

  validateRetention() {
    this.success = "";
    this.error = "";

    let balance = JSON.parse(localStorage.getItem("balance"));

    if(this.formData.value.amount.replace(/\./g, "") < this.minVal)
    {
      this.error = "El retiro mínimo es de $"+this.numberFormatUI(this.minVal); 
    }
    else if(this.formData.value.amount.replace(/\./g, "") > this.maxVal)
    {
      this.error = "El retiro máximo es de $"+this.numberFormatUI(this.maxVal); 
    }
    else if(this.formData.value.amount.replace(/\./g, "") > balance.totalBalance)
    {
      this.error = "No tienes dinero suficiente para retirar"; 
    }
    else if (this.formData.status == "VALID") {
      this.formData.patchValue({
        externalUID: uuid.v1(),
        amount: this.formData.value.amount.replace(/\./g, ""),
      });

      this.isLoading = true;

      this.service.validateRetention({
        amount:this.formData.value.amount.replace(/\./g, "")
      })
      .subscribe(response => {

        this.isLoading = false;

        this.isConfirm = true;
        this.hideSelect.emit();
        this.flagDoc = response['flagDoc'];
  
        this.formData.patchValue({
          valorRetencion: response['valorRetencion'],
          valoraRetirar: response['valoraRetirar']
        })
      }, 
      err => {
        this.isLoading = false;
        if (
          err.status == 422 &&
          err.error.errorCode &&
          err.error.errorDescription
        ) {
          this.error = err.error.errorDescription;
        } else {
          this.error = "Hubo un error al realizar el retiro";
        }
      });

      
    }
  }

  makeWithdrawal()
  {
      this.error = '';

      if(this.flagDoc && !this.formatImage)
      {
        this.error = 'Debes subir la imagen del formato diligenciado';
      }
      else 
      {
        this.isConfirm = false;
        this.isLoading = true;

        var form = new FormData();
        for (const key in this.formData.value) {
          if(key == 'amount') {
            form.append(key, this.formData.value[key].replace(/\./g, ""));
          } else {
            form.append(key, this.formData.value[key]);
          }
        }

        if(this.formatImage)
        {
          form.append('foto', this.formatImage, this.formatImage.name);
        }

        this.service.sendWithdrawal(form).subscribe(
          (response) => {
            this.isLoading = false;
            this.formData = new FormGroup({
              accountNumber: new FormControl("", [Validators.required]),
              bankCode: new FormControl("", [Validators.required]),
              amount: new FormControl("", [Validators.required]),
              accountType: new FormControl("", [Validators.required]),
              paymentMethod: new FormControl("251", [Validators.required]),
              externalUID: new FormControl(uuid.v1(), [Validators.required]),
              valorRetencion: new FormControl(0, [Validators.required]),
              valoraRetirar: new FormControl(0, [Validators.required]),
              formulario: new FormControl('',[])
            });
            this.success = "Recuerda que verás el saldo en tu banco, una vez cumplidos los tiempos que toman las transferencias interbancarias.";

            this.getBalance();
          },
          (err) => {
            this.isLoading = false;

            if (
              err.status == 422 &&
              err.error.errorCode &&
              err.error.errorDescription
            ) {
              this.error = err.error.errorDescription;
            } else {
              this.error = "Hubo un error al realizar el retiro";
            }
          }
        );
      }
  }

  getResources() {
    this.isLoading = true;
    this.service.getResources().subscribe(
      (response) => {
        this.isLoading = false;
        this.banks = response["P_BANCOS"];
        this.paymentMethods = response["P_FORMAS_PAGO"];
        this.accountTypes = response["P_TIPOS_CUENTA"];
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getBalance() {
    let session: any = JSON.parse(localStorage.getItem("session"));
    this.serviceLogin.getBalance(session.accessToken).subscribe((response) => {
      localStorage.setItem("balance", JSON.stringify(response['body']));
      localStorage.setItem(
        "balanceLetUpdate",
        (new Date().getTime() + 120000).toString()
      );
    });
  }

  changeImage(event)
  { 
    this.error = '';
    let image = event.target.files[0];

    if(image && image.type == 'image/jpeg')
    {
      this.formatImage = image;
    }
    else 
    { 
      if(image)
      {
        this.error = 'Formato incorrecto, debe subir una imagen jpg';
      }
      this.formatImage = null;
    }

  }

  closeModal(){
    this.dialogRef.close();
  }

  numberFormat(field) {
    var num = this.formData.value[field].replace(/\./g, "");

    if (!isNaN(num)) {
      num = num
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
      num = num.split("").reverse().join("").replace(/^[\.]/, "");
      this.formData.patchValue({
        [field]: num,
      });
    } else {
      this.formData.patchValue({
        [field]: this.formData.value[field].replace(/[^\d\.]*/g, ""),
      });
    }
  }
}

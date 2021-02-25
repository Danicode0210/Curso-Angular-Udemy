import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";

import { Store } from "@ngrx/store";

import { Subscription } from "rxjs";

import { AppState } from "./../../../app.state";
import { AssetsService } from "../../../services/assets.service";
import { LoginService } from "./../../../services/login.service";

import { DataComponent } from "./data/data.component";
import { TermsComponent } from "./terms/terms.component";
import { UpdatePopupComponent } from "./update-popup/update-popup.component";
const moment = require("moment");
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent implements OnInit {
  public formData: FormGroup;
  public formRecovery: FormGroup;
  public errorMessage: string = "";
  public formError: string = "";
  public formSuccess: string = "";
  public isLoading: boolean = false;
  public isSubmited: boolean = false;
  public assetsSubscription: Subscription;
  public texts: any;
  public terms: any;
  public i18n: any;
  private tmpToken: string;
  public isRecovery: boolean = false;
  public termsUrl: string = "";
  public loginError: string = "";
  public textBotonRegister = 'Registrarse';
  public textBotonRetry = 'Volver A Intentar';
  public textLinkRecovery = 'Recuperar Contraseña';
  constructor(
    public dialog: MatDialog,
    private assetsService: AssetsService,
    private store: Store<AppState>,
    private service: LoginService,
    private snackBar: MatSnackBar
  ) {
    this.formData = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });

    this.formRecovery = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {

    this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.texts = assets.texts;
        this.terms = assets.terms;
        this.i18n = assets.i18n;
      });

      setTimeout(function(){
        window['initCaptcha']();
      },1000);
  }

  hasError(field: string, error: string | null = null) {
    if (error) {
      return this.isSubmited && this.formData.controls[field].hasError(error);
    } else {
      return (
        this.isSubmited && this.formData.controls[field].status === "INVALID"
      );
    }
  }

  hasErrorRecovery(field: string, error: string | null = null) {
    if (error) {
      return (
        this.isSubmited && this.formRecovery.controls[field].hasError(error)
      );
    } else {
      return (
        this.isSubmited &&
        this.formRecovery.controls[field].status === "INVALID"
      );
    }
  }

  openDialogUpdate(): void {
    const dialogRef = this.dialog.open(UpdatePopupComponent, {
      panelClass: "blue-dialog",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Set login
        window.location.href = "/cuenta";
      } else {
        location.reload();
      }
    });
  }

  recoveryPass() {
    console.log("Recovering...");
    this.isSubmited = true;
    /* Reset login error */
    this.errorMessage = "";
    this.formError = "";
    this.formSuccess = "";

    if (this.formRecovery.status == "VALID") {
      this.isLoading = true;
      this.service.recoveryPass(this.formRecovery.value.email).subscribe(
        (response) => {
          this.isLoading = false;
          this.formSuccess = "SuccessRecovery";
        },
        (err) => {
          this.isLoading = false;
          if (err.status == 404) {
            this.formError = "EmailNotFound";
          } else {
            this.formError = "ErrorRecovery";
          }
        }
      );
    }
  }

  gaEventLoginTryAgain() {
    this.errorMessage = '';
    const event = {
      event: 'ga_event_login',
      category: 'Iniciar sesion',
      action: 'BPW - Login',
      label: this.textBotonRetry
    };
    window.dataLayer.push(event);
  }

  gaEventLogin(): void {
    const event = {
      event: 'ga_event',
      category: 'Registro',
      action: 'BPW - Login',
      label: this.textBotonRegister
    };
    console.log(event);
    window.dataLayer.push(event);
  }

  gaEventRecovery(): void {
    this.isRecovery = true;
    const event = {
      event: 'ga_event',
      category: 'Recuperar clave',
      action: 'BPW - Login',
      label: this.textLinkRecovery
    };
    window.dataLayer.push(event);
  }

  gaEventRecoveryPass(event: any): void {
    const buttonId = event.target.attributes.id.nodeValue;
    const eventGa = {
      event: 'ga_event',
      category: 'Recuperar clave',
      action: 'BPW - Ingresar correo',
      label : buttonId === 'recovery' ? 'Recuperar' : 'Atras'
    };
    window.dataLayer.push(eventGa);
  }

  gaEventLoginSuccess(userIdS: string, success: boolean): void {

    const event = {
      event: 'ga_event_login',
      category: 'Iniciar sesion',
      action: 'BPW - Login',
      label: 'Ingresar - ' + (success === true ? 'Exitoso' : 'Fallido'),
      userId: userIdS
    };
    window.dataLayer.push(event);
  }

  /* Login function */
  login() {
    /* Reset login error */
    this.loginError = "";
    localStorage.removeItem("isSisplay");

    if (this.formData.status == "VALID") {
      this.isLoading = true;

      /* Make login */
      this.service.login(JSON.stringify(this.formData.value)).subscribe(
        (response: any) => {
          if (response.status == 202) {

            this.tmpToken = response.body.accessToken;

            /* Get Terms */
            this.assetsService.getTerms().subscribe(
              (response: any) => {
                if (response.code == "100") {
                  if (response.data.length > 0) {
                    this.termsUrl = response.data[0].path;
                    this.openDialog();
                  } else {
                    this.termsUrl = "terminos.pdf";
                    this.openDialog();
                  }
                } else {
                  this.termsUrl = "terminos.pdf";
                  this.openDialog();
                }
              },
              (err) => {
                this.termsUrl = "terminos.pdf";
                this.openDialog();
              }
            );
          } else if (response.status == 200) {
            this.makeLogin(response.body);
          } else {
            this.createSession(response.body, "false");
          }
        },
        (err) => {
          this.isLoading = false;
          if (err.status == 401) {
            this.errorMessage = "WrongCredentials";
            this.gaEventLoginSuccess('', false);
          } else if (err.status == 418) {
            this.errorMessage = "WrongLocation";
            this.gaEventLoginSuccess('', false);
          } else if (err.status == 422 && err.error.message) {
            this.errorMessage = 'GeneralLoginError';
            this.gaEventLoginSuccess('', false);
          } else if (err.status == 403) {
            this.errorMessage = 'GeneralLoginError';
            this.gaEventLoginSuccess('', false);
          } else {
            this.errorMessage = "GeneralLoginError";
            this.gaEventLoginSuccess('', false);
          }
        }
      );
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(TermsComponent, {
      data: { url: this.terms.path },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.acceptTerms();
      }
    });
  }

  acceptTerms() {
    this.isLoading = true;
    this.service.acceptTerms(this.tmpToken).subscribe(
      () => {
        this.login();
      },
      () => {
        this.isLoading = false;
        this.snackBar.open(
          "Hubo un error por favor intenta de nuevo",
          "Cerrar",
          {
            duration: 2000,
          }
        );
      }
    );
  }

  validateFlag() {
    return this.i18n.dataRequest === "active";
  }

  async validateVIP(profile) {
    return new Promise((resolve, reject) => {
      if (!this.validateFlag()) {
        resolve();
        return false;
      }

      let docNumber = profile.identityDocument.number;
      let lastIsVip = localStorage.getItem(`${docNumber}-lastIsVip`);
      let lastSendIsVip = localStorage.getItem(`${docNumber}-send-lastIsVip`);
      let today = `${new Date().getMonth()}-${new Date().getDate()}-${new Date().getFullYear()}`;

      if (lastIsVip && lastIsVip == today) {
        resolve();
        return false;
      }

      if (lastSendIsVip && lastSendIsVip >= today) {
        resolve();
        return false;
      }

      var documentType = profile.identityDocument.type;

      if(documentType == 'C.C' || documentType == 1)
      {
        documentType = 'ID';
      }
      else if(documentType == 'C.E' || documentType == 4)
      {
        documentType = 'RES';
      }

      //Validate data modal
      this.service
        .isVIP({
          docNumber: profile.identityDocument.number,
          type: documentType,
        })
        .subscribe(
          (response) => {
            if (response.status == 201) {
              this.openDialogData(
                profile.identityDocument.number,
                profile.identityDocument.type
              );
              reject();
            } else {
              localStorage.setItem(`${docNumber}-lastIsVip`, today);
              resolve();
            }
          },
          (err: any) => {
            resolve();
          }
        );
    });
  }

  openDialogData(_documentNumber, _type): void {
    const dialogRef = this.dialog.open(DataComponent, {
      data: { documentNumber: _documentNumber, type: _type },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.login();
      }
    });
  }

  makeLogin(_data) {

    /* Get profile data */
    this.service.getProfile(_data.accessToken).subscribe(
      (response: any) => {
        var profile = response.body;
        this.validateVIP(profile)
          .then(() => {
            this.service.getBalance(_data.accessToken).subscribe(
              (response) => {
                this.gaEventLoginSuccess(profile.accountId, true);
                localStorage.setItem("balance", JSON.stringify(response.body));
                localStorage.setItem(
                  "balanceLetUpdate",
                  (new Date().getTime() + 120000).toString()
                );
                localStorage.setItem(
                  "balanceMinAge",
                  moment(new Date()).add(2, "minutes").toISOString()
                );
                localStorage.setItem(
                  "lastLogin",
                  moment(new Date()).toISOString()
                );
                localStorage.setItem("profile", JSON.stringify(profile));
                localStorage.setItem("session", JSON.stringify(_data));
                localStorage.setItem(
                  "minTokenRefresh",
                  (new Date().getTime() + 500000).toString()
                );

                if (
                  (this.i18n["updateDataModal"] == "active" &&
                    !localStorage.getItem("minUpdateModal")) ||
                  parseInt(localStorage.getItem("minUpdateModal")) <
                    new Date().getTime()
                ) {
                  this.openDialogUpdate();
                  return false;
                } else {
                  location.reload();
                }
              },
              (err) => {
                this.isLoading = false;
                this.openSnackBar(
                  "Hubo al recuperar el balance del usuario",
                  "Cerrar"
                );
              }
            );
          })
          .catch((err) => {
            this.isLoading = false;
          });
      },
      () => {
        this.isLoading = false;
        this.openSnackBar(
          "Hubo al recuperar la información del usuario",
          "Cerrar"
        );
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createSession(_data, isSisplay) {
    this.validateVIP(_data.profile)
      .then(() => {
        localStorage.setItem("balance", JSON.stringify(_data.balance));
        localStorage.setItem(
          "balanceLetUpdate",
          (new Date().getTime() + 120000).toString()
        );
        localStorage.setItem(
          "balanceMinAge",
          moment(new Date()).add(2, "minutes").toISOString()
        );
        localStorage.setItem("lastLogin", moment(new Date()).toISOString());
        localStorage.setItem("profile", JSON.stringify(_data.profile));
        localStorage.setItem("session", JSON.stringify(_data.session));
        localStorage.setItem(
          "minTokenRefresh",
          (new Date().getTime() + 500000).toString()
        );
        localStorage.setItem("isSisplay", isSisplay);
        this.gaEventLoginSuccess(_data.profile.accountId, true);
        if (
          (this.i18n["updateDataModal"] == "active" &&
            !localStorage.getItem("minUpdateModal")) ||
          parseInt(localStorage.getItem("minUpdateModal")) <
            new Date().getTime()
        ) {
          this.openDialogUpdate();
          return false;
        } else {
          location.reload();
        }
        // Validate update popup
      })
      .catch((err) => {
        this.isLoading = false;
      });
  }
}

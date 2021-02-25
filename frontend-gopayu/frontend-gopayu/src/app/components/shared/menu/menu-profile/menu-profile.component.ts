import { MatDialogRef, ErrorStateMatcher, MatSnackBar, MatDialog  } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { PhoneValidationComponent } from 'src/app/components/registration/phone-validation/phone-validation/phone-validation.component';
import { MessagingService } from 'src/app/services/messaging.service';
import { Subscription } from 'rxjs';
import { AppState } from './../../../../app.state';
import { Store } from '@ngrx/store';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PopUpErrorComponent } from 'src/app/components/registration/pop-up-error/pop-up-error.component';
@Component({
  selector: 'app-menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: []
})
export class MenuProfileComponent implements OnInit {
  public formSuccess = '';
  public profile:any;
  public type:number = 0;
  public textBotonCambiarContrasena = 'Cambiar Contraseña';
  public textBotonEnviarDocumentos = 'Enviar Documentos';
  public textBotonTerminosyCondiciones = 'Terminos Y Condiciones';
  public textBotonActualizarDatos = 'Actualizar Datos';
  public currentUserPhoneNumber = '';
  public isVerified = false;
  public assetsSubscription: Subscription;
  public localTexts$;
  public formConfig$;
  public isLoading = false;
  public formError = '';
  constructor(
    private dialogRef:MatDialogRef<MenuProfileComponent>,
    private messagingService: MessagingService,
    public dialog: MatDialog,
    private store: Store<AppState>
  ) {
      this.profile = JSON.parse(localStorage.getItem('profile'));
      if(this.profile)
      {
        this.profile.name = this.profile.firstName + ' ' + this.profile.firstName2 + ' ' + this.profile.lastName + ' ' + this.profile.lastName2;
        this.profile.name = this.profile.name.replace(' null ', ' ');
      }
  }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('profile'));
    this.currentUserPhoneNumber = userData.mobile;
    this.assetsSubscription = this.store
      .select('assets')
      .subscribe((assets) => {
        this.localTexts$ = assets.i18n;
        this.formConfig$ = assets.registerConfig;
      });
  }

  closeModal()
  {
      this.dialogRef.close();
  }

  setType(_type)
  {
      this.type = _type;
  }

  gaEventProfile(labels: string): void {
    const event = {
      event: 'ga_event',
      category: 'Perfil usuario',
      action: 'BPW - Mi cuenta',
      label: labels
    };
    window.dataLayer.push(event);
  }

  onClickUpdateProfile(clickEvent: any): void {
    this.formSuccess = '';
    const buttonId = clickEvent.target.attributes.id.nodeValue;
    this.formError = '';
    if (buttonId === 'button1') {
      this.type = 1;
      this.gaEventProfile(this.textBotonCambiarContrasena);
    } else if (buttonId === 'button2') {
      this.type = 2;
      this.gaEventProfile(this.textBotonEnviarDocumentos);
    } else if (buttonId === 'button3') {
      this.type = 3;
      this.gaEventProfile(this.textBotonTerminosyCondiciones);
    } else if (buttonId === 'button4') {
      if (this.currentUserPhoneNumber === '' ) {
        this.formError = 'notAvailablePhoneNumber';
      } else {
        const profile = JSON.parse(localStorage.getItem('profile'));
        const modificationDate = new Date(profile.modificationDate);
        const actualDate = new Date();
        let differeneceDays = (actualDate.getTime() - modificationDate.getTime());
        differeneceDays = differeneceDays / (1000 * 3600 * 24);
        if (Math.floor(differeneceDays) >= 30) {
          console.log(this.localTexts$['MessagingService']['status']);
          if (this.formConfig$['MessagingService']['status'] === 'active') {
            this.validatePhoneNumber();
          } else {
            this.type = 4;
          }
        } else {
          this.dialog.open(PopUpErrorComponent, {
            panelClass: 'menu-dialog',
            data: {
              message: this.localTexts$.DataActualization['actualizationPeriodError'],
              title: 'Actualización de datos'
            }
          })
        }
      }
      this.gaEventProfile(this.textBotonActualizarDatos);
      //this.updateClick();
    }
  }

  validatePhoneNumber() {
    this.isLoading = true;
    const chanel = this.formConfig$['MessagingService']['chanel'];
    switch (chanel){
      case '1':
        this.validatePhoneNumberHablame();
        break;
      case '2':
        this.validatePhoneNumberBlipBlip();
        break;
      default:
        this.validatePhoneNumberHablame();
        break;
    }    
  }

  validatePhoneNumberHablame() {
    this.messagingService.generateMessageHablame('57' + this.currentUserPhoneNumber, 0).subscribe((data: any) => {
      if (data.code === '001') {
        this.isLoading = false;
        this.messagingService.encryptCode(data.response.code);
        const dialogRef = this.dialog.open(PhoneValidationComponent, {
          panelClass: 'menu-dialog',
          data: {phone: this.currentUserPhoneNumber, isVerified: this.isVerified, textToDisplay: this.localTexts$.DataActualization['textDataActualization'], isRegister: 0},
          });
        dialogRef.afterClosed().subscribe(
              (result) => {
                console.log(result.isVerified);
                if (result.isVerified) {
                  this.type = 4;
                } else {
                  this.isLoading = false;
                }
            });
      } else if (data.code === '003'|| data.code === '002') {
        this.isLoading = false;
        this.formError = 'ErrorPhoneValidationHLB';
      }
    }, (err) => {
      this.isLoading = false;
      this.formError = 'ErrorPhoneValidationHLB';
    });
  }

  validatePhoneNumberBlipBlip() {
    this.messagingService.generateMessageBlipBlip(this.currentUserPhoneNumber, 0).subscribe((data: any) => {
      if (data.code === '001') {
        this.isLoading = false;
        this.messagingService.encryptCode(data.response.code);
        const dialogRef = this.dialog.open(PhoneValidationComponent, {
          panelClass: 'menu-dialog',
          data: {phone: this.currentUserPhoneNumber, isVerified: this.isVerified, textToDisplay: this.localTexts$.DataActualization['textDataActualization'], isRegister: 0},
          });
        dialogRef.afterClosed().subscribe(
              (result) => {
                console.log(result.isVerified);
                if (result.isVerified) {
                  this.type = 4;
                } else {
                  this.isLoading = false;
                }
            });
      } else if (data.code === '003'|| data.code === '002') {
        this.isLoading = false;
        this.formError = 'ErrorPhoneValidationBLP';
      }
    }, (err) => {
      this.isLoading = false;
      this.formError = 'ErrorPhoneValidationBLP';
    });
  }

  updateClick(){
    this.type = 0;
    localStorage.setItem('minUpdateModal',(new Date().getTime()+31500000000).toString());
  }

  updateCurrentInformation(newInformation: any) {
    this.profile = newInformation;
    this.profile.name = this.profile.firstName + ' ' + this.profile.firstName2 + ' ' + this.profile.lastName + ' ' + this.profile.lastName2;
    this.profile.name = this.profile.name.replace(' null ', ' ');
    this.type = 0;
    this.formSuccess = 'SuccessProfileUpdate';
  }

  showUpdatedPasswordSuccesfully() {
    this.formSuccess = 'SuccessParsswordUpdate';
    this.type = 0;
  }

}

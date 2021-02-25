import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { RegisterService } from 'src/app/services/register.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessagingService } from 'src/app/services/messaging.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppState } from './../../../../app.state';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-phone-validation',
  templateUrl: './phone-validation.component.html',
  styleUrls: ['./phone-validation.component.styl']
})
export class PhoneValidationComponent implements OnInit {

  public timeLeft;
  public timeToDisplay = ':00';
  public interval;
  public isCodeValid = true;
  public formData: FormGroup;
  public error: string;
  public assetsSubscription: Subscription;
  public localTexts$;
  private isBrowser: boolean;
  public isLoading = false;


  constructor(
    private messagingService: MessagingService,
    private dialogRef: MatDialogRef<PhoneValidationComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.formData = new FormGroup({
      verificationCode: new FormControl('', [
        Validators.required,
      ])
    });
    dialogRef.disableClose = true;
    if (this.isBrowser) {
      this.assetsSubscription = this.store
        .select('assets')
        .subscribe((assets) => {
          this.localTexts$ = assets.registerConfig;
        });
    }
  }

  ngOnInit() {
    const timeToValidatePhoneNumber = this.localTexts$.MessagingService['TimeToValidatePhoneNumber'];
    this.timeLeft = parseInt(timeToValidatePhoneNumber) * 60;
    this.timeToDisplay = timeToValidatePhoneNumber + this.timeToDisplay;
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.transfromTime(this.timeLeft);
      } else {
        this.isCodeValid = false;
        this.pauseTimer();
        this.formData.reset();
        this.error = '';
      }
    }, 1000);
  }

  transfromTime(time: number): void {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    if (minutes !== 0) {
      if (seconds.toString().length === 1) {
        this.timeToDisplay = minutes + ':0' + seconds;
      } else {
        this.timeToDisplay = minutes + ':' + seconds;
      }
    } else {
      if (seconds.toString().length === 1) {
        this.timeToDisplay = '0' + seconds;
      } else {
        this.timeToDisplay = seconds.toString();
      }
    }
  }

  verifyPhoneNumber(): void {
    const regCode = this.formData.get('verificationCode').value;
    const res = this.messagingService.validateMessage(regCode);
    if (res) {
      this.closeDialog(true);
    } else {
      this.error = 'El código ingresado es incorrecto, por favor verifique';
    }
  }

  deleteCode(): void {
    const phoneNumber = '57' + this.data.phone;
    sessionStorage.removeItem('code');
  }

  cancelPhoneVerification(): void {
    this.deleteCode();
    this.closeDialog(false);
  }

  resendCode(): void {
    this.error = '';
    this.isLoading = true;
    const chanel = this.localTexts$['MessagingService']['chanel'];
    switch (chanel){
      case '1':
        this.resendCodeHablame();
        break;
      case '2':
        this.resendCodeBlipBlip();
        break;
      default:
        this.resendCodeHablame();
        break;
    }
  }
  resendCodeHablame() {
    this.messagingService.generateMessageHablame('57' + this.data.phone, this.data.isRegister).subscribe( (data: any) => {
      if (data.code === '001') {
        this.messagingService.encryptCode(data.response.code);
        this.isLoading = false;

        const timeToValidatePhoneNumber = this.localTexts$.MessagingService['TimeToValidatePhoneNumber'];
        this.timeLeft = parseInt(timeToValidatePhoneNumber) * 60;
        this.timeToDisplay = timeToValidatePhoneNumber + ':00';

        this.timeLeft = this.timeLeft;
        this.isCodeValid = true;
        this.startTimer();
      } else if (data.code === '003' || data.code === '002') {
        this.closeDialog(false);
      }
    }, (err: any) => {
      this.error = this.localTexts$.playerValidationError['serverErrorPhoneValidationHLB'];
      this.isLoading = false;
    });
  }

  resendCodeBlipBlip() {
    this.messagingService.generateMessageBlipBlip(this.data.phone, this.data.isRegister).subscribe( (data: any) => {
      if (data.code === '001') {
        this.messagingService.encryptCode(data.response.code);
        this.isLoading = false;

        const timeToValidatePhoneNumber = this.localTexts$.MessagingService['TimeToValidatePhoneNumber'];
        this.timeLeft = parseInt(timeToValidatePhoneNumber) * 60;
        this.timeToDisplay = timeToValidatePhoneNumber + ':00';

        this.timeLeft = this.timeLeft;
        this.isCodeValid = true;
        this.startTimer();
      } else if (data.code === '003') {
        this.closeDialog(false);
      }
    }, (err: any) => {
      this.error = this.localTexts$.playerValidationError['serverErrorPhoneValidationBLP'];
      this.isLoading = false;
    });
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  closeDialog(isVerified): void {
    this.dialogRef.close({isVerified: isVerified});
  }

}

import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, ErrorStateMatcher, MatSnackBar, MatDialog } from '@angular/material';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppState } from './../../../../../app.state';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ResourcesService } from 'src/app/services/resources.service';
import { RegisterService } from 'src/app/services/register.services';
import { MessagingService } from 'src/app/services/messaging.service';
import { PhoneValidationComponent } from 'src/app/components/registration/phone-validation/phone-validation/phone-validation.component';
import { RepeatedPhoneNumberComponent } from '../../../repeated-phone-number/repeated-phone-number.component';
import { PopUpErrorComponent } from 'src/app/components/registration/pop-up-error/pop-up-error.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-menu-update-information',
  templateUrl: './menu-update-information.component.html',
  styleUrls: ['./menu-update-information.component.styl']
})
export class MenuUpdateInformationComponent implements OnInit {
  @Output()
  private changePage = new EventEmitter();
  @Output() 
  onUpdateInformation = new EventEmitter<any>();
  private moment = require("moment");
  private isBrowser: boolean;
  public isLoading = true;
  public assetsSubscription: Subscription;
  public texts$;
  public disableSubmit = true;
  public localTexts$;
  public isVerified = false;
  public formData: FormGroup;
  public addressTypes: Array <String> = [ 'AC', 'AK', 'AUT', 'AV', 'CL', 'CRV', 'DG', 'TV', 'KM', 'CR', 'CIR'];
  public propertyTypes: Array <String> = [ 'AP', 'ET', 'LC', 'CON', 'CONJ', 'ESQ', 'P', 'BL', 'IN', 'ED', 'OF', 'TO', 'CRT', 'CA'];
  public selectedCountry;
  public countries: Array<Object> = new Array();
  public departments: Array<Object> = new Array();
  public cities: Array<Object> = new Array();
  public days: Array<Number> = new Array();
  public checkedBoxAcceptTerms = true;
  public checkedBoxPromotionalInfo = true;
  public success = '';
  public months: Array<String> = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  public expeditionYears: Array<Number> = new Array();
  public expirationYears: Array<Number> = new Array();
  public userData: any;
  public email;
  public mobile;
  public addressLine1;
  public addressLine2;
  public addressLine3;
  public aditionalInfo;
  public residenceCountry;
  public residenceDepartment;
  public residenceCity;
  public addressStreetType;
  public propertyType;
  public expirationDay;
  public expirationMonth;
  public expirationYear;
  public expeditionDay;
  public expeditionMonth;
  public expeditionYear;
  public documentType;
  public residenceChanged = false;
  public formError = '';
  public updateDocumentDates = false;
  public formConfig$;
  public disposableDomains:any;
  public currentTerms: string = 'https://apicrm.betplay.com.co/terms/Terminos%20y%20condiciones%20201904.pdf';
  public originalForm = {
    email: '',
    mobile: '',
    addressType: '',
    address1: '',
    address2: '',
    address3: '',
    optionalDataType: '',
    optionalDataField: '',
    residenceCountry: '',
    residenceDepartement: '',
    residenceMunicipality: '',
    expeditionDay: '',
    expeditionMonth: '',
    expeditionYear: '',
    expirationDay: '',
    expirationMonth: '',
    expirationYear: ''
  };
  constructor(
    private dialogRef: MatDialogRef<MenuUpdateInformationComponent>,
    private store: Store<AppState>,
    private service: ResourcesService,
    private registerService: RegisterService,
    private snackBar: MatSnackBar,
    private messagingService: MessagingService,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: Object
    ) {
      this.isBrowser = isPlatformBrowser(platformId);
      this.formData = new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.minLength(6)
        ]),
        cnfEmail: new FormControl('', [
          Validators.required
        ]),
        mobile: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[0-9\s]*$/),
          Validators.minLength(10)
        ]),
        addressType: new FormControl('', [
          Validators.required
        ]),
        num1: new FormControl('', [
          Validators.required
        ]),
        num2: new FormControl('', [
          Validators.required
        ]),
        num3: new FormControl('', [
          Validators.required
        ]),
        extraType: new FormControl('', [
        ]),
        extraInfo: new FormControl('', [
        ]),
        fiscalResidenceRegion: new FormControl('', [
          Validators.required
        ]),
        residenceCity: new FormControl('', [
          Validators.required
        ]),
        residenceCountry: new FormControl('', [Validators.required]),
        acceptTerms: new FormControl('', []),
        acceptPromotionalInfo: new FormControl('', [])
      });
    }

  ngOnInit() {
    if (this.isBrowser) {
      this.initDays();
      this.initExpeditionYears();
      this.initExpirationYears();
      this.getCountries();
      this.assetsSubscription = this.store
      .select('assets')
      .subscribe((assets) => {
        this.texts$ = assets.texts;
        this.localTexts$ = assets.localTexts;
        this.formConfig$ = assets.registerConfig;
        const domains: any = assets.disposableDomains;
        this.disposableDomains = domains.DisposableDomains; 
      });
    }
  }

  getCountries() {
      this.service.getCountries()
      .subscribe((response: any) => {
          this.countries = response;
          this.getRegions();
      });
  }

  getRegions() {
    this.service.getRegions('CO')
    .subscribe((response: any) => {
        this.departments = response;
        this.getUserData();
    });
  }

  getCities(patchValue: boolean) {
      this.residenceCity = '';
      this.isLoading = true;
      this.service.getCities(this.residenceDepartment)
      .subscribe((response: any) => {
          this.cities = response;
          this.isLoading = false;
          if (patchValue) {
            const city: any = this.cities.find((item: any) => JSON.stringify(item.description) === JSON.stringify(this.userData.residence.cityText));
            this.residenceCity = city.code;
            this.originalForm.residenceMunicipality = city.code;
          } else {
            this.disableSubmit = false;
          }
      });
  }

  initDays() {
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
  }

  initExpeditionYears() {
    const current = new Date().getFullYear();

    for (let i = current; i >= current - 100; i--) {
      this.expeditionYears.push(i);
    }
  }

  initExpirationYears() {
    const current = new Date().getFullYear();

    for (let i = current; i <= current + 100; i++) {
      this.expirationYears.push(i);
    }
  }

  getUserData(): void {

    // se obtine el usuario desde el localStorage
    this.userData = JSON.parse(localStorage.getItem('profile'));
    const address = this.userData.residence.address.trim();
    const addressTerms = address.split(' ');

    this.originalForm.email = this.userData.email;
    this.originalForm.mobile = this.userData.homePhoneNumber;
    this.originalForm.address1 = addressTerms[1];
    this.originalForm.address2 = addressTerms[3];
    this.originalForm.address3 = addressTerms[5];
    this.originalForm.addressType = addressTerms[0];

    // se actualiza la información en el formulario
    this.formData.get('email').patchValue(this.userData.email);
    this.formData.get('cnfEmail').patchValue(this.userData.email);
    this.formData.get('mobile').patchValue(this.userData.homePhoneNumber);
    this.formData.get('num1').patchValue(addressTerms[1]);
    this.formData.get('num2').patchValue(addressTerms[3]);
    this.formData.get('num3').patchValue(addressTerms[5]);
    this.addressStreetType = addressTerms[0];

    const country: any = this.countries.find((item: any) => JSON.stringify(item.code) === JSON.stringify(this.userData.residence.countryCode));
    this.residenceCountry = country.code;
    this.originalForm.residenceCountry = country.code;
    const department: any = this.departments.find((item: any) => JSON.stringify(item.code) === JSON.stringify(this.userData.residence.regionCode));
    this.residenceDepartment = department.code;
    this.originalForm.residenceDepartement = department.code;
    this.getCities(true);

    if (addressTerms.length > 6) {
      this.formData.get('extraInfo').patchValue(addressTerms[7]);
      this.originalForm.optionalDataField = addressTerms[7];
      this.originalForm.optionalDataType = addressTerms[6];
      this.propertyType = addressTerms[6];
    }

  }

  residenceUpdate(): void {
    if (!this.residenceChanged) {
      this.disableSubmit = false;
      this.residenceChanged = true;
      this.residenceCity = '';
      this.residenceDepartment = '';
    }
  }

  updateUserData(): void {
    console.log(this.formData.status);
    this.formError = '';
    this.success = '';
    const isFormChanged = this.checkChangedForm();
    if (isFormChanged) {
      if (this.formData.value.email !== this.formData.value.cnfEmail) {
        this.formError = 'EmailNotMatch';
      }
      else if (!this.formData.value.acceptTerms) {
        this.formError = 'AccetpTerms';
      }
      else if (this.formConfig$["DisposableEmailValidation"]["status"] === "active") {
        if (this.isDisposableEmail(this.formData.value.email)) {
          this.dialog.open(PopUpErrorComponent, {
            panelClass: 'menu-dialog',
            data: {
              message: this.localTexts$['playerValidationError']['errorDisposableEmail'],
              title: 'Correo eléctronico invalido.'
            }
          });
          this.formError = 'errorDisposableEmail';
        }
      } 
      if (this.formError === '' && this.formData.status === 'VALID') {
        this.isLoading = true;
        let errorMessage = (this.localTexts$['validatePhoneNumberMessageActualization']) ? this.localTexts$['validatePhoneNumberMessageActualization'] : "El número móvil ingresado no puede ser utilizado para esta cuenta, por favor ingrese otro.";
        if(this.localTexts$['validatePhoneNumber'] == "active") {
          this.service.validatePhoneNumber({
            phoneNumber: this.formData.value.mobile,
            documentNumber: this.userData.identityDocument.number,
            documentType: this.documentType,
            playerName: this.userData.firstName + ' ' + this.userData.firstName2 + ' ' + this.userData.lastName + ' ' + this.userData.lastName2
          }).subscribe(response => {
            this.isLoading = false;
            if(response['status'] === 201)
            {
              this.snackBar.open(errorMessage, "Cerrar");
            }
            else 
            {
              this.sendNewInformation();
            }
          },
          (err) => {
            console.log(err);
            if(err['status'] === 404)
            {
              this.snackBar.open(errorMessage, "Cerrar");
            }
            else 
            {
              this.sendNewInformation();
            }
          });
        } else {
          this.sendNewInformation();
        }
      }
    }
  }


  sendNewInformation() {
    this.isLoading = true;
    let expeditionDate = null;
    let expirationDate = null;
    let email = '';
    if (this.email !== this.userData.email) {
      email = this.email;
    }

    let mobile = '';
    if (this.mobile !== this.userData.mobile) {
      mobile = this.mobile;
    }
    const address = this.addressStreetType + ' ' + this.addressLine1 + ' # ' + this.addressLine2 + ' - ' + this.addressLine3 + ' ' +(typeof this.propertyType !== 'undefined' ? this.propertyType : '') + ' ' + (typeof this.aditionalInfo !== 'undefined' ? this.aditionalInfo : '');

    const request = {
      document: this.userData.identityDocument.number,
      email: email,
      mobile: mobile,
      address: address,
      residenceCountry: this.residenceCountry,
      residenceDepartement: this.residenceCountry === 'CO' ? this.residenceDepartment : '',
      residenceCity: this.residenceCountry === 'CO' ? this.residenceCity : '',
      acceptsReceivingEmails: String(this.checkedBoxPromotionalInfo)
    };
    const oldData = {
      document: this.userData.identityDocument.number,
      email: this.userData.email,
      address: this.userData.residence.address,
      residenceCountry: this.userData.residence.countryCode,
      residenceDepartement: this.userData.residence.regionCode,
      residenceCity: this.userData.residence.cityCode
    }

    const dataSend = {
      newData: request,
      oldData: oldData
    };
    this.registerService.playerActualization(dataSend).subscribe(
      (res: any) => {
          this.isLoading = false;
          this.success = 'Sus datos fueron actualizados satisfactoriamente.';
      }, (data) => {
        this.isLoading = false;
        if (data.status === 200) {
          const city: any = this.cities.find((item: any) => JSON.stringify(item.code) === JSON.stringify(this.residenceCity));
          const department: any = this.departments.find((item: any) => JSON.stringify(item.code) === JSON.stringify(this.residenceDepartment));  
          this.disableSubmit = true;
          this.success = 'Sus datos fueron actualizados satisfactoriamente.';
          this.userData.email = this.email;
          this.userData.mobile = this.mobile;
          this.userData.homePhoneNumber = this.mobile;
          this.userData.residence.address = address;
          this.userData.residence.addressNumber = address;
          this.userData.residence.countryCode = this.residenceCountry;
          this.userData.residence.regionCode = this.residenceDepartment;
          this.userData.residence.regionText = department.description;
          this.userData.residence.cityCode = this.residenceCity;
          this.userData.residence.cityText = city.description;
          this.userData.identityDocument.expirationDate = expeditionDate;
          this.userData.identityDocument.issueDate = expirationDate;
          this.userData.modificationDate = new Date();
          localStorage.setItem('profile', JSON.stringify(this.userData));
          this.onUpdateInformation.emit(this.userData);
        } else if (data.status === 422) {
          this.formError = data.error.validationErrors[0].errorDesc;
          if (this.formError === 'EL NÚMERO DE TELÉFONO QUE ESTÁ INGRESANDO, YA SE ENCUENTRA REGISTRADO EN LA PLATAFORMA.') {
            this.dialog.open(RepeatedPhoneNumberComponent, {
              panelClass: 'menu-dialog'
            });
          }
        }
      }
    );
  }

  goBack() {
      this.changePage.emit();
  }

  checkChangedForm() {
    let formChanged = false;
    if (this.originalForm.email !== this.email) {
      formChanged = true;
    }
    if (this.originalForm.mobile.toString() !== this.mobile.toString()) {
      formChanged = true;
    }
    if (this.originalForm.addressType !== this.addressStreetType) {
      formChanged = true;
    }
    if (this.originalForm.address1 !== this.addressLine1) {
      formChanged = true;
    }
    if (this.originalForm.address2 !== this.addressLine2) {
      formChanged = true;
    }
    if (this.originalForm.address3 !== this.addressLine3) {
      formChanged = true;
    }
    if (this.originalForm.optionalDataType !== this.propertyType) {
      formChanged = true;
    }
    if (this.originalForm.optionalDataField !== this.aditionalInfo) {
      formChanged = true;
    }
    if (this.originalForm.residenceCountry !== this.residenceCountry) {
      formChanged = true;
    }
    if (this.originalForm.residenceDepartement !== this.residenceDepartment) {
      formChanged = true;
    }
    if (this.originalForm.residenceMunicipality !== this.residenceCity) {
      formChanged = true;
    }
    if (!this.checkedBoxPromotionalInfo) {
      formChanged = true;
    }
    return formChanged;
  }

  enableSubmit() {
    this.disableSubmit = false;

  }

  isDisposableEmail(email: string): boolean {
    const splitStr = email.split('@');
    const domainCom = splitStr[1].split('.');
    const domain = domainCom[0];
    if (this.disposableDomains.includes(domain)) {
      return true;
    } else {
      return false;
    }
  }
}

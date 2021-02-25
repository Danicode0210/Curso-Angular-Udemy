import { AppState } from './../../app.state';
import { environment } from './../../../environments/environment';
import { ResourcesService } from './../../services/resources.service';
import { RegisterService } from './../../services/register.services';
import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ErrorStateMatcher } from "@angular/material/core";
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { RecommendationComponent } from './recomendation/recommendation.component';
import { RegistryErrorComponent } from './registry-error/registry-error/registry-error.component';
import { PhoneValidationComponent } from './phone-validation/phone-validation/phone-validation.component';
import { MessagingService } from 'src/app/services/messaging.service';
import { UpdatePopupComponent } from '../shared/login/update-popup/update-popup.component';
import * as moment from 'moment';
import { AssetsService } from 'src/app/services/assets.service';
import { LoginService } from 'src/app/services/login.service';
import { TermsComponent } from '../shared/login/terms/terms.component';
import { DataComponent } from '../shared/login/data/data.component';
import { LimitsModalComponent } from './limits-modal/limits-modal.component';
import { PopUpErrorComponent } from './pop-up-error/pop-up-error.component';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

declare global {
  interface Window { dataLayer: any; }
}

/** Error when invalid control is dirty, touched, or submitted. */
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
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.styl']
})
export class RegistrationComponent implements OnInit {

  public expeditionDay = '';
  public expeditionMonth = '';
  public expeditionYear = '';
  public expirationDay = '';
  public expirationMonth = '';
  public expirationYear = '';
  public addressType = '';
  public bornDay = '';
  public bornMonth = '';
  public bornYear = '';
  public step:number = 1;
  public isSubmited: boolean = false;
  public formData: FormGroup;
  public isLoading:boolean = true;
  public loaded:boolean = false;
  public matcher = new MyErrorStateMatcher();
  private moment = require("moment");
  public selectedExpeditionPlace = false;
  public selectedCityAddr = false;
  public disposableDomains: any;
  public selectedNationality = true;
  private uuidv1 = require("uuid");
  public formError:string = "";
  public male = '1';
  public female = '2';
  public ludopath = '1';
  public notLudopath = '2';
  public isPep = '1';
  public notPep = '2';
  public addressTypes:Array<String> = [ 'AC', 'AK', 'AUT', 'AV', 'CL', 'CRV', 'DG', 'TV', 'KM', 'CR', 'CIR'];
  public countries:Array<Object> = new Array();
  public suggestedCountries: Array<Object> = new Array();
  public suggestedCitiesDepartments: Array<Object> = new Array();
  public suggestedCitiesDepartmentsAddr: Array<Object> = new Array();
  public departments:Array<Object> = new Array();
  public expeditionYears: Array<Number> = new Array();
  public expirationYears: Array<Number> = new Array();
  private isBrowser;
  public siteKey:string;
  public assetsSubscription: Subscription;
  public phoneNumber = '';
  public documentNumber:string = '';
  public documentType = 3;
  public playerName:string = '';
  public localTexts$;
  public passwordDoesNotMatch = false;
  /* Get tetxs */
  private tmpToken: string;
  public texts$;
  public formConfig$;
  public enableCountry = false;
  public enableCitiesDepartments = false;
  public enableCitiesDepartmentsAddr = false;
  public documentTypes: Array<Object>;
  public years: Array<Number> = new Array();
  public days: Array<Number> = new Array();
  public genders: Array<Object>;
  public citiesDepartments: Array<any> = new Array();
  public citiesDepartmentsAddr: Array<Object> = new Array();
  private CEValidPeriodInYears: number;
  public maxLengthId = 10;
  public selectedCountry = '';
  public selectedCity = '';
  public selectedResidenceCity = '';
  public readOnlyCountry = true;
  public termsUrl: string = "";
  public terms: any;
  public recaptcha = false;
  @ViewChild('captchaControl', { static: true }) input: ElementRef;

  public months: Array<String> = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  public data: any = {
    acceptsReceivingEmails:"true",
    personTitle: "88",
    userResidenceRegionText:"",
    currency: "7",
    language: "8",
    documentSupportNumber: "",
    mobilePhoneCountryCode:'+57',
    promotionalCode2:"",
    provenanceCode: "",
    regionText: "",
    securityQuestion: '1',
    securityQuestionAnswer: 'N/A',
    addrNumber: "1",
    externalUID:"",
    acceptDataProtection:"true",
    cityAddress:"",
    codigo_procedencia:"",
    codigo_promocional:"",
    codigo_promocional2:"",
    dailyBetLimit:"3600000",
    dailyRechargeLimit:"3600000",
    external_uid:"",
    metadataCuenta:"",
    monthlyBetLimit: "18000000",
    monthlyRefillLimit: "18000000",
    movil: "",
    mpio_exp_doc: "181",
    phone: "3108137133",
    weeklyBetLimit: "9000000",
    weeklyRechargeLimit: "9000000"
  };
  public isVerified = false;


  constructor(private service:ResourcesService,
              private loginService:LoginService,
              private title: Title,
              private meta: Meta,
              private store:Store<AppState>,
              @Inject(PLATFORM_ID) platformId: Object,
              private regiterService:RegisterService,
              private router:Router,
              private datepipe: DatePipe,
              private assetsService: AssetsService,
              private messagingService: MessagingService,
              private render: Renderer2,
              public dialog: MatDialog) {

            this.isBrowser = isPlatformBrowser(platformId);
            this.title.setTitle("Regístrate en BetPlay");
            this.meta.updateTag({
              name: 'description',
              content: 'Se parte de BetPlay.com.co la plataforma de Apuestas Deportivas Online más grande en Colombia. Aliados de SUPERGIROS y SURED. Autoriza Coljuegos, +18, N° C1444.'
            });
            this.assetsSubscription = this.store.select('assets').subscribe( assets => {
              this.texts$ = assets.i18n;
              this.localTexts$ = assets.i18n;
              this.formConfig$ = assets.registerConfig;
              const domains: any = assets.disposableDomains;
              this.disposableDomains = domains.DisposableDomains;  
              this.CEValidPeriodInYears = parseInt(this.formConfig$['form']['CEValidPeriodInYears']); 
              this.siteKey = environment.reCatpchaKey;
              this.formData.patchValue({
                monthLimit: this.localTexts$["Register"]["Limits"]["monthLimit"],
                weekLimit: this.localTexts$["Register"]["Limits"]["weekLimit"],
                dayLimit: this.localTexts$["Register"]["Limits"]["dayLimit"]
              })
            });

            this.formData = new FormGroup({
              firstName: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern(/^[a-zA-ZñÑ \s]*$/)
              ]),
              firstName2: new FormControl("", [
                Validators.minLength(2),
                Validators.pattern(/^[a-zA-ZñÑ \s]*$/),
              ]),        
              lastName: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern(/^[a-zA-ZñÑ \s]*$/)
              ]),
              lastName2: new FormControl("", [
                Validators.minLength(2),
                Validators.pattern(/^[a-zA-ZñÑ \s]*$/),
              ]),
              mobilePhoneNumber: new FormControl('', [
                Validators.required,
                Validators.minLength(10),
                Validators.pattern(/^[0-9][0-9]*$/),
                this.regexValidator(new RegExp('^3'), {startsWith3: 'mustStratWith3'})
              ]),
              email: new FormControl('', [
                Validators.required,
                Validators.email,
                Validators.minLength(6)
              ]),
              password: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(12),
                Validators.pattern(/^[0-9A-Za-z\s]*$/),
              ]),
              cnfPassword: new FormControl('', [
                Validators.required,
              ]),      
              nationality: new FormControl('', [
                Validators.required
              ]),
              gender: new FormControl('', [
                Validators.required
              ]),
              ludopath: new FormControl('', [
                Validators.required
              ]),
              pep: new FormControl('', [
                Validators.required
              ]),
              documentType: new FormControl('', [
                Validators.required
              ]),
              expeditionPlace: new FormControl('', [
                Validators.required
              ]),
              cityAddress: new FormControl('', [
                Validators.required
              ]),
              bornDay: new FormControl("", [Validators.required]),
              bornMonth: new FormControl("", [Validators.required]),
              bornYear: new FormControl("", [Validators.required]),
              expeditionDay: new FormControl("", [Validators.required]),
              expeditionMonth: new FormControl("", [Validators.required]),
              expeditionYear: new FormControl("", [Validators.required]),
              expirationDay: new FormControl("", []),
              expirationMonth: new FormControl("", []),
              expirationYear: new FormControl("", []),
              documentNumber: new FormControl("", [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(10),
                Validators.pattern(/^[1-9][0-9]*$/)
              ]),
              addressType: new FormControl('', [Validators.required]),
              address1: new FormControl('', [Validators.required]), 
              address2: new FormControl('', [Validators.required]), 
              address3: new FormControl('', [Validators.required]),     
              acceptsTerms: new FormControl('', [
              ]),
              acceptsReceivingPromotionalInformation: new FormControl('', [
              ]),   
              acceptsLimits: new FormControl('', [
              ]),  
              storeCode: new FormControl('', [
              ]),  
              referrer: new FormControl('', [
              ])
            });
            this.formData.get('gender').patchValue('1');
            this.formData.get('ludopath').patchValue('2');
            this.formData.get('pep').patchValue('2');
            this.formData.get('acceptsReceivingPromotionalInformation').patchValue(true);
            this.formData.get('acceptsLimits').patchValue(true);
        }

  ngOnInit() {
      if(this.isBrowser)
      { 
        this.getRegions();
        this.getCitiesAndDepartments();
        this.getCountries();
        this.getDocumentTypes();
        this.initDays();
        this.initYears();
        this.getGenders();
        this.formData.controls['documentType'].setValue('3');
        this.initExpeditionYears();
        this.initExpirationYears();
        window.dataLayer.push({
          'pagina': 'datos-identificacion',
          'event': 'pageview'
        });
      }
  }

  suggestCountries() {
    this.enableCountry = true;
    this.selectedNationality = false;
    if (this.countries.length !== 0) {
      this.suggestedCountries = this.countries.filter(
        (country: any) => country.description.toUpperCase().startsWith(this.formData.get('nationality').value.toUpperCase())).slice(0,5);
    }
    this.formData.controls.nationality.markAllAsTouched();
  }

  

  login() {
    const credentials = {
      password: this.formData.value.password,
      userName: this.formData.value.documentNumber
    };
    this.isLoading = true;
    this.loginService.login(JSON.stringify(credentials)).subscribe(
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
          this.formError = "WrongCredentials";
        } else if (err.status == 418) {
          this.formError = "WrongLocation";
        } else if (err.status == 422 && err.error.message) {
          this.formError = 'GeneralLoginError';
        } else if (err.status == 403) {
          this.formError = 'GeneralLoginError';
        } else {
          this.formError = "GeneralLoginError";
        }
      }
    );
  }

  makeLogin(_data) {

    /* Get profile data */
    this.loginService.getProfile(_data.accessToken).subscribe(
      (response: any) => {
        var profile = response.body;
        this.validateVIP(profile)
          .then(() => {
            this.loginService.getBalance(_data.accessToken).subscribe(
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
                  (this.localTexts$["updateDataModal"] == "active" &&
                    !localStorage.getItem("minUpdateModal")) ||
                  parseInt(localStorage.getItem("minUpdateModal")) <
                    new Date().getTime()
                ) {
                  this.openDialogUpdate();
                  return false;
                } else {
                  location.reload();
                }
                this.isLoading = false;
                this.router.navigate(['/registro-exitoso']);
              },
              (err) => {
                this.isLoading = false;
                this.gaEventLoginSuccess('', false);
              }
            );
          })
          .catch((err) => {
            this.isLoading = false;
          });
      },
      () => {
        this.isLoading = false;
      }
    );
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
          (this.localTexts$["updateDataModal"] == "active" &&
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

  validateFlag() {
    return this.localTexts$.dataRequest === "active";
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
      this.loginService
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
    this.loginService.acceptTerms(this.tmpToken).subscribe(
      () => {
        this.login();
      },
      () => {
        this.isLoading = false;
        this.openModal('Hubo un error por favor intenta de nuevo');
      }
    );
  }

  suggestCitiesDepartments() {
    this.enableCitiesDepartments = true;
    this.selectedExpeditionPlace = false;
    if (this.citiesDepartments.length !== 0) {
      this.suggestedCitiesDepartments = this.citiesDepartments.filter(
        (cityDep: any) => cityDep.city_department.toUpperCase().startsWith(this.formData.get('expeditionPlace').value.toUpperCase())).slice(0,5);
    }
  }

  suggestCitiesDepartmentsAddr() {
    this.enableCitiesDepartmentsAddr = true;
    this.selectedCityAddr = false;
    if (this.citiesDepartmentsAddr.length !== 0) {
      this.suggestedCitiesDepartmentsAddr = this.citiesDepartmentsAddr.filter(
        (cityDep: any) => cityDep.city_department.toUpperCase().startsWith(this.formData.get('cityAddress').value.toUpperCase())).slice(0,5);
    }
  }

  enableSuggestion(type: string) {
    if (type === 'country') {
      this.enableCountry = true;
    } else {
      this.enableCitiesDepartments = true;
    }
  }

  disableSuggestion(type: string) {
    if (type === 'country') {
      this.enableCountry = !this.disableSuggestion;
      this.setValueCountry('', '');
    } else if (type === 'addr') {
      this.enableCitiesDepartmentsAddr = !this.enableCitiesDepartmentsAddr;
      this.setValueCityDepartmentAddr('', '');
    } else {
      this.enableCitiesDepartments = !this.enableCitiesDepartments;
      this.setValueCityDepartment('', '');
    }
  }

  setValueCountry(value, code) {
    this.selectedCountry = code;
    this.formData.get('nationality').patchValue(value.toUpperCase());
    this.enableCountry = false;
    if (value === '' || code === '') {
      this.selectedNationality = false;
    } else {
      this.selectedNationality = true;
    }
  }

  setValueCityDepartment(value, code) {
    this.selectedCity = code;
    this.formData.get('expeditionPlace').patchValue(value);
    this.enableCitiesDepartments = false;
    if (value === '' || code === '') {
      this.selectedExpeditionPlace = false;
    } else {
      this.selectedExpeditionPlace = true;
    }
  }

  setValueCityDepartmentAddr(value, code) {
    this.selectedResidenceCity = code;
    this.formData.get('cityAddress').patchValue(value);
    this.enableCitiesDepartmentsAddr = false;
    if (value === '' || code === '') {
      this.selectedCityAddr = false;
    } else {
      this.selectedCityAddr = true;
    }
  }

  setDepartments(_departments)
  {
      this.departments = _departments;
  }
  returnPage()
  {
      this.step = this.step-1;
  }
  getRegions()
  {
    this.service.getRegions('CO')
    .subscribe((response:any) => {
        this.departments = response;
        this.isLoading = false;
        this.loaded = true;
    });
  }

  getCountries()
  {
      this.formData.get('nationality').patchValue('COLOMBIA');
      this.selectedCountry = 'CO';
      this.service.getCountries()
      .subscribe((response:any) => {
          this.countries = response;
      });
  }

  getCitiesAndDepartments(){
    this.service.getCitiesAndDepartments().subscribe(
      (response: any) => {
        this.citiesDepartments = response;
        this.citiesDepartmentsAddr = response;
        //this.openModal(this.localTexts$['Register'].RecommendationMessage);
      }
    );
  }


  getDocumentTypes() {
    this.service.getDocumentTypes().subscribe((response: any) => {
      this.documentTypes = new Array();
      for (let i = 0; i < response.length; i++) {
        if (response[i].code == "4" || response[i].code == "3") {
          this.documentTypes.push(response[i]);
          console.log(this.documentTypes);
        }
      }
      this.isLoading = false;
    });
  }

  initYears() {
    var current = new Date().getFullYear() - 17;

    for (let i = current; i >= current - 100; i--) {
      this.years.push(i);
    }
  }

  initDays() {
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
  }

  getGenders() {
    this.service.getGenders().subscribe((response: any) => {
      this.genders = response;
    });
  }


  setValidationIdField(): void {
    let validator;
    this.formData.removeControl('documentNumber');
    const documentType = this.formData.get('documentType').value;
    if (documentType === '4') {
      validator = [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(7),
        Validators.pattern(/^[1-9][0-9]*$/),
      ];
      this.formData.get('nationality').patchValue('');
      this.selectedCountry = '';
      this.readOnlyCountry = false;
      this.maxLengthId = 7;
      this.formData.get('expirationDay').setValidators([Validators.required]);
      this.formData.get('expirationMonth').setValidators([Validators.required]);
      this.formData.get('expirationYear').setValidators([Validators.required]);
      this.formData.get('expirationDay').updateValueAndValidity();
      this.formData.get('expirationMonth').updateValueAndValidity();
      this.formData.get('expirationYear').updateValueAndValidity();
      this.selectedNationality = false;
      //this.textMaxDocumentNumber = 'El número de documento no puede contener más de ' + '7' + ' dígitos';
    } else if (documentType === '3' || this.selectedCountry === 'CO') {
      validator = [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern(/^[1-9][0-9]*$/),
      ];
      this.formData.get('nationality').patchValue('COLOMBIA');
      this.formData.get('nationality').disable;
      this.selectedCountry = 'CO';
      this.readOnlyCountry = true;
      this.maxLengthId = 10;
      this.selectedNationality = true;
      //this.textMaxDocumentNumber = 'El número de documento no puede contener más de 10 dígitos';
      this.formData.get('expirationDay').setValidators([]);
      this.formData.get('expirationMonth').setValidators([]);
      this.formData.get('expirationYear').setValidators([]);
      this.formData.get('expirationDay').updateValueAndValidity();
      this.formData.get('expirationMonth').updateValueAndValidity();
      this.formData.get('expirationYear').updateValueAndValidity();
    }
    this.formData.addControl('documentNumber', new FormControl('', validator));
    
  }

  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  

  checkPasswordsEqualityFormPassword() {
    const password = this.formData.get('password').value;
    const cnfPassword = this.formData.get('cnfPassword').value;
    if (password !== cnfPassword) {
      this.formData.get('cnfPassword').setErrors({notEqualPasswords: 'notEqualPasswords'});
    } else {
      console.log(password !== cnfPassword);
      this.formData.get('cnfPassword').clearValidators();
      this.formData.get('cnfPassword').updateValueAndValidity();
    }
  }

  register(){
    this.gaEventRegisterButton();
    var dateAge =
    new Date().getFullYear() -
    18 +
    "-" +
    (new Date().getMonth() + 1) +
    "-" +
    new Date().getDate();

    this.formError = '';
    const validateExpeditionDate = this.validateDocumentRegistrationDate();
    const isExpeditionDateLessThanExpirationDate = this.validateExpeditionDateIsLessThanExpirationDate();
    this.isSubmited = true;
    this.markFormGroupTouched(this.formData);
    if (this.formData.status !== 'INVALID') {
      if (this.formData.get('documentType').value === '4') {
        if (!isExpeditionDateLessThanExpirationDate) {
          this.formError = this.formConfig$.Errors['ExpirationDateIsLessThanExpeditionDate'];
          this.openModal(this.formError);
        }
      }
      if (new Date(dateAge) <
      new Date(
        `${this.formData.value.bornYear}-${this.formData.value.bornMonth}-${this.formData.value.bornDay}`
      )) {
        this.formError = this.formConfig$.Errors['PlayerUnderAge'];
        this.openModal(this.formError);
      }
      else if (!validateExpeditionDate) {
        this.formError = this.formConfig$.Errors['ExpeditionDate'];
        this.openModal(this.formError);
      }
      else if (!this.selectedExpeditionPlace || this.selectedCity === '') {
        this.formError = this.formConfig$.Errors['EmptyExpeditionPlace'];
        this.openModal(this.formError);
      } 
      else if (!this.selectedNationality || this.selectedCountry === '') {
        this.formError = this.formConfig$.Errors['EmptyNationality'];
        this.openModal(this.formError);
      } 
      else if (!this.selectedCityAddr || this.selectedResidenceCity === '') {
        this.formError = this.formConfig$.Errors['EmptyResidencePlace'];
        this.openModal(this.formError);
      }
      else if (this.formData.value.password != this.formData.value.cnfPassword)
      {
        this.formError = this.formConfig$.Errors['PasswordNotMatch'];
        this.openModal(this.formError);
      }
      else if (this.formData.value.ludopath !== '2') {
        this.formError = this.formConfig$.Errors['AcceptInterdict'];
        this.openModal(this.formError);
      } 
      else if (!this.formData.value.acceptsTerms) {
        this.formError = this.formConfig$.Errors['AccetpTerms'];
        this.openModal(this.formError);
      }
      else if(!this.recaptcha)
      {
        this.formError = this.formConfig$.Errors['RobotValidation'];
        this.openModal(this.formError);
      }
      else if (!this.formData.value.acceptsLimits) {
        this.formError = this.formConfig$.Errors['AcceptLimits'];
        this.openModal(this.formError);
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
          this.formError = this.localTexts$['playerValidationError']['errorDisposableEmail'];
        }  
      } 
      
      if (this.formError === '') {
        if (this.formConfig$["Compliance"]["status"] !== "active") {
          if (this.formConfig$["BlackListValidation"]["validatePhoneNumber"] === 'active') {
            this.isPhoneNumberInBlackList();
          } else {
            if (this.formConfig$['MessagingService']['status'] === 'active') {
              this.twoFactorAuthentication();
            } else {
              this.sendData();
            }
          }
        } else {
          let fullname: string = `${this.formData.controls.firstName.value.trim()} ${this.formData.controls.firstName2.value.trim()} ${this.formData.controls.lastName.value.trim()} ${this.formData.controls.lastName2.value.trim()}`.replace(
            "  ",
            " "
          );  
          let expeditionDate = new Date(this.formData.controls.expeditionYear.value, parseInt(this.formData.controls.expeditionMonth.value) - 1, this.formData.controls.expeditionDay.value).toISOString();
          let expeditionDateSplit = this.datepipe.transform(expeditionDate, 'dd/MM/yyyy');
          let typeId = this.formData.value.documentType == "3" ? "cc" : "ce";
          let dataSend = {
            datoConsultar: this.formData.controls.documentNumber.value,
            tipoDocumento: typeId,
            fechaExpedicion: expeditionDateSplit,
            name: fullname,
            validateDate: this.formConfig$.Compliance.validateDates
          };
          this.isLoading = true;
          this.regiterService.compliance(dataSend).subscribe(
            (response) => {
              this.isLoading = false;
              const res: any = response.body;
              switch (res.code) {
                case '001':
                  if (this.formConfig$["BlackListValidation"]["validatePhoneNumber"] === 'active') {
                    this.isPhoneNumberInBlackList();
                  } else {
                    if (this.formConfig$['MessagingService']['status'] === 'active') {
                      this.twoFactorAuthentication();
                    } else {
                      this.sendData();
                    }
                  }
                break;
                case '002':
                  this.openModal('Verifica tu nombre real');
                  break;
                case '004':
                  this.openModal('Cédula no encontrada');
                  break;
                case '003':
                  this.openModal('Verifica la fecha de expedición de tu cedula');
                  break;
                case '006':
                  this.openModal('Verifica tu documento de identidad CP.');
                  break;
                case '005':
                  if (this.formConfig$['MessagingService']['status'] === 'active') {
                    this.twoFactorAuthentication();
                  } else {
                    this.sendData();
                  }
              }
            },
            () => {
              this.isLoading = false;
            }
          );
        }
        


      }
    }
  }


  isPhoneNumberInBlackList() {
    this.isLoading = true;
    let fullname: string = `${this.formData.controls.firstName.value.trim()} ${this.formData.controls.firstName2.value.trim()} ${this.formData.controls.lastName.value.trim()} ${this.formData.controls.lastName2.value.trim()}`.replace(
      "  ",
      " "
    );  
    let errorMessage = (this.localTexts$['validatePhoneNumberMessageActualization']) ? this.localTexts$['validatePhoneNumberMessageActualization'] : "El número móvil ingresado no puede ser utilizado para esta cuenta, por favor ingrese otro.";
    this.service.validatePhoneNumber({
      phoneNumber: this.formData.value.mobilePhoneNumber,
    }).subscribe(response => {
      this.isLoading = false;
      if(response['status'] === 201)
      {
        this.openModal(errorMessage);
      }
      else 
      {
        if (this.formConfig$['MessagingService']['status'] === 'active') {
          this.twoFactorAuthentication();
        } else {
          this.sendData();
        }
      }
    },
    (err) => {
      this.isLoading = false;
      if(err['status'] === 404)
      {
        this.openModal(errorMessage);
      }
      else 
      {
        if (this.formConfig$['MessagingService']['status'] === 'active') {
          this.twoFactorAuthentication();
        } else {
          this.sendData();
        }
      }
    });
  }

  twoFactorAuthentication() {
    const chanel = this.formConfig$['MessagingService']['chanel'];
    switch (chanel){
      case '1':
        this.twoFactorAuthenticationHablame();
        break;
      case '2':
        this.twoFactorAutheticationBlipBlip();
        break;
      default:
        this.twoFactorAuthenticationHablame();
        break;
    }
  }

  twoFactorAutheticationBlipBlip() {
    this.isLoading = true;
    const phoneNumber = this.formData.value.mobilePhoneNumber;
    this.messagingService.generateMessageBlipBlip(phoneNumber, 1).subscribe((data: any) => {
      this.isLoading = false;
      if (data.code === '001') {
        this.messagingService.encryptCode(data.response.code);
        const dialogRef = this.dialog.open(PhoneValidationComponent, {
          panelClass: 'menu-dialog',
          data: {phone: phoneNumber, isVerified: this.isVerified, isRegister: 1}
          });
        this.isLoading = false;
        dialogRef.afterClosed().subscribe(
              (result) => {
                if (result.isVerified) {
                  this.sendData();
                } else {
                  this.gaEventRegister('', false, 'Cancelar');
                }
            });
      } else if (data.code === '003') {
        this.sendData();
      } else {
        this.formError = this.formConfig$.playerValidationError['serverErrorPhoneValidationBLP'];
        this.openModal(this.formError);
        this.isLoading = false;
      }
    }, (err) => {
      this.formError = this.formConfig$.playerValidationError['serverErrorPhoneValidationBLP'];
      this.openModal(this.formError);
      this.isLoading = false;
    });
  }

  twoFactorAuthenticationHablame() {
    this.isLoading = true;
    const phoneNumber = this.formData.value.mobilePhoneNumber;
    this.messagingService.generateMessageHablame('57' + phoneNumber, 1).subscribe((data: any) => {
      this.isLoading = false;
      if (data.code === '001') {
        this.messagingService.encryptCode(data.response.code);
        const dialogRef = this.dialog.open(PhoneValidationComponent, {
          panelClass: 'menu-dialog',
          data: {phone: '57' + phoneNumber, isVerified: this.isVerified, isRegister: 1}
          });
        this.isLoading = false;
        dialogRef.afterClosed().subscribe(
              (result) => {
                if (result.isVerified) {
                  this.sendData();
                } else {
                  this.gaEventRegister('', false, 'Cancelar');
                }
            });
      } else if (data.code === '003' || data.code === '002') {
        this.sendData();
      } else {
        this.formError = this.formConfig$.playerValidationError['serverErrorPhoneValidationHBL'];
        this.openModal(this.formError);
        this.isLoading = false;
      }
    }, (err) => {
      this.formError = this.formConfig$.playerValidationError['serverErrorPhoneValidationHBL'];
      this.openModal(this.formError);
      this.isLoading = false;
    });
  }

  sendData() {
    this.buildDataToSend();
    this.isLoading = true;
    this.regiterService.registerPlayer(this.data).subscribe((data: any) => {
      window.dataLayer.push({
          'pagina': 'registro-exitoso',
          'event': 'pageview'
      });
      this.gaEventRegister(data.accountCode, true, 'Enviar');
      this.isLoading = false;
      this.login();
    },
    err => {
      this.isLoading = false;
      if(err.status == 422)
      {
          let  erros = err.error.validationErrors;
          this.gaEventRegister('', false, 'Enviar');
          for(var i = 0; i < erros.length; i++)
          {
              if(erros[i].errorCode)
              {
                this.formError = erros[i].errorCode;
                if(!this.formError)
                {
                    this.formError = erros[i].errorCode;
                }  
                if (this.formError === 'El numero de celular ya se encuentra registrado') {
                  this.dialog.open(RegistryErrorComponent, {
                    panelClass: 'menu-dialog'
                  });
                } else {
                  this.openModal(this.formError);  
                }
                return false;

              }
          }
      }
      else
      {
        this.formError = this.localTexts$.playerValidationError['UnexpextedError'];
        this.openModal(this.formError);  
      }
    });
  }

  buildDataToSend() {
    //userName
    this.data.userName = this.formData.value.documentNumber;
    // nombre1
    this.data.firstName = this.formData.value.firstName.replace(/ /g,'');
    this.data.firstName = this.data.firstName.trim();
    // nombre2
    this.data.firstName2 = this.formData.value.firstName2.replace(/ /g,'');
    this.data.firstName2 = this.data.firstName2.trim();
    // apellido1
    this.data.lastName = this.formData.value.lastName.replace(/ /g,'');
    this.data.lastName = this.data.lastName.trim();
    // apellido 2
    this.data.lastName2 = this.formData.value.lastName2.replace(/ /g,'');
    this.data.lastName2 = this.data.lastName2.trim();
    // email
    this.data.email = this.formData.value.email;
    // genero
    this.data.gender = this.formData.value.gender;
    // fec_nacimiento
    const birthYear = this.formData.value.bornYear;
    const birthMonth = this.formData.value.bornMonth;
    const birthDay = this.formData.value.bornDay;
    this.data.birthDate = new Date(birthYear, parseInt(birthMonth) - 1, birthDay).toISOString();
    this.data.bornDay = parseInt(birthDay);
    this.data.bornMonth = birthMonth;
    this.data.bornYear = parseInt(birthYear);
    // mpio_nacimiento
    // fec_exp_doc
    const expeditionYear = this.formData.value.expeditionYear;
    const expeditionMonth = this.formData.value.expeditionMonth;
    const expeditionDay = this.formData.value.expeditionDay
    this.data.expeditionDay = parseInt(expeditionDay);
    this.data.expeditionMonth = expeditionMonth;
    this.data.expeditionYear = parseInt(expeditionYear);
    this.data.documentDateIssued = new Date(expeditionYear, parseInt(expeditionMonth) - 1, expeditionDay).toISOString();
    // fec_ven_doc
    if (this.formData.value.documentType == "4") {
      const expirationYear = this.formData.value.expirationYear;
      const expirationMonth = this.formData.value.expirationMonth;
      const expirationDay = this.formData.value.expirationDay
      this.data.expirationDay = parseInt(expirationDay);
      this.data.expirationMonth = expirationMonth;
      this.data.expirationYear = parseInt(expirationYear);
      this.data.documentDateExpired = new Date(expirationYear, parseInt(expirationMonth) - 1, expirationDay).toISOString();
    } else {
      this.data.documentDateExpired = new Date(
        this.moment(new Date()).add(100, "years")
      ).toISOString();

    }
    // nacionalidad
    this.data.nationality = this.selectedCountry;
    // tipo_saludo
    // mpio_exp_documento
    this.data.mpio_exp_doc = this.selectedCity;
    // indicativo_pais
    // telefono
    this.data.phone = this.formData.value.mobilePhoneNumber;
    // direccion
    const num2Add = this.formData.value.address2.indexOf('#') !== -1 ? this.formData.value.address2 :  "# " +this.formData.value.address2;
    const num3Add = this.formData.value.address3.indexOf('-') !== -1 ? this.formData.value.address3 :  "- " +this.formData.value.address3;

    this.data.address = `${this.formData.value.addressType} ${this.formData.value.address1} ${num2Add} ${num3Add}`;
    // referido
    // celular
    this.data.mobile = this.formData.value.mobilePhoneNumber;
    // mpio_direccion
    this.data.cityAddress = this.selectedResidenceCity;
    // codigo_postal
    this.data.addrPostCode = '1140';
    // idioma
    // moneda
    // metadataCuenta
    // codigo_promocional
    // codigo_promocional2
    // external_uid
    this.data.external_uid = this.uuidv1();
    // codigo_procedencia
    // num_doc
    this.data.documentNumber = this.formData.value.documentNumber;
    // tipo_doc
    this.data.documentType = String(this.formData.value.documentType);
    // password
    this.data.password = this.formData.value.password;
    this.data.cnfPassword = this.formData.value.cnfPassword;
    //acceptsReceivingEmails
    this.data.acceptsReceivingEmails = String(this.formData.value.acceptsReceivingPromotionalInformation);
    // acceptsTerms
    this.data.acceptsTerms = this.formData.value.acceptsTerms.toString();

    this.data.countryOfBirth = this.selectedCountry;
    this.data.documentPlaceOfIssuing = this.selectedCity;

    const referrer = this.formData.value.referrer;

    if (referrer.charAt(0) === '3') {
      this.data.referrer = referrer;
    } else if (referrer.charAt(0) === '2') {
      this.data.codigo_promocional = referrer;
    }
    this.data.codigo_promocional2 = this.formData.value.storeCode;

    this.data.monthlyRefillLimit = String(this.formConfig$["Limits"]["monthLimit"]);
    this.data.dailyRechargeLimit = String(this.formConfig$["Limits"]["weekLimit"]);
    this.data.weeklyRechargeLimit = String(this.formConfig$["Limits"]["dayLimit"]);

    this.data.monthlyBetLimit = String(this.formConfig$["Limits"]["monthLimit"]);
    this.data.dailyBetLimit = String(this.formConfig$["Limits"]["weekLimit"]);
    this.data.weeklyBetLimit = String(this.formConfig$["Limits"]["dayLimit"]);
  }

  setUpperCase(){
    this.formData.patchValue({
      firstName: this.formData.value.firstName.toUpperCase(),
      firstName2: this.formData.value.firstName2.toUpperCase(),
      lastName: this.formData.value.lastName.toUpperCase(),
      lastName2: this.formData.value.lastName2.toUpperCase(),
      nationality: this.formData.value.nationality.toUpperCase(),
      expeditionPlace: this.formData.value.expeditionPlace.toUpperCase(),
      address1: this.formData.value.address1.toUpperCase(),
      address2: this.formData.value.address2.toUpperCase(),
      address3: this.formData.value.address3.toUpperCase(),
      cityAddress: this.formData.value.cityAddress.toUpperCase()
    })
  }
  setLowerCase(){
    this.formData.patchValue({
      email: this.formData.value.email.toLowerCase(),
    })
  }

  hasError(field, error) {
    if(!error)
    {
      return this.formData.controls[field].status == 'INVALID';
    }
    else
    {
      return (this.formData.controls[field].touched && this.formData.controls[field].hasError(error))
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();      
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  openModal(text: string): void {
    this.dialog.open(RecommendationComponent, {
      panelClass: 'menu-dialog',
      data: {content: text}
    });
  }

  validateDocumentRegistrationDate(): boolean {
    const day = this.formData.get('expeditionDay').value;
    const month = this.formData.get('expeditionMonth').value;
    const year = this.formData.get('expeditionYear').value;
    const date = year + '-' + month + '-' + day;
    const expedition = new Date(date);
    const actualDate = new Date();
    if (expedition > actualDate) {
      return false;
    } else {
      return true;
    }
  }

  validateExpeditionDateIsLessThanExpirationDate(): boolean {
    const expeditionDay = this.formData.get('expeditionDay').value;
    const expeditionMonth = this.formData.get('expeditionMonth').value;
    const expeditionYear = this.formData.get('expeditionYear').value;

    const expirationDay = this.formData.get('expirationDay').value;
    const expirationMonth = this.formData.get('expirationMonth').value;
    const expirationYear = this.formData.get('expirationYear').value;

    const expeditionDate = expeditionYear + '-' + expeditionMonth + '-' + expeditionDay;
    const expirationDate = expirationYear + '-' + expirationMonth + '-' + expirationDay;

    const expedition = new Date(expeditionDate);
    const expiration = new Date(expirationDate);

    if (expedition < expiration) {
      return true;
    } else {
      return false;
    }

  }

  initExpirationYears() {
    var current = new Date().getFullYear();

    for (let i = current; i <= current + this.CEValidPeriodInYears; i++) {
      this.expirationYears.push(i);
    }
  }

  initExpeditionYears() {
    var current = new Date().getFullYear();

    for (let i = current; i >= current - 100; i--) {
      this.expeditionYears.push(i);
    }
  }

  openLimitsModal() {
    const limits = {
      day: String(this.formConfig$["Limits"]["textDayLimit"]),
      month: String(this.formConfig$["Limits"]["textMonthLimit"]),
      week: String(this.formConfig$["Limits"]["textWeekLimit"])
    };
    this.dialog.open(LimitsModalComponent, {
      panelClass: 'menu-dialog',
      data: limits
    });
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

  gaEventRegisterButton() {
    const gender = this.formData.get('gender').value === '1' ? 'Masculino' : 'Femenino';
    const event = {
      'event':'ga_event',
      'category':'Registro',
      'action':'BPW - Formulario registro',
      'label': 'Registrarse',
      'generoRegistro': gender
    }

    window.dataLayer.push(event);
  }

  gaEventRegister(userIdS: string, success: boolean, textBoton: string): void {

    let event = {
      event: 'ga_event',
      category: 'Registro',
      action: 'BPW - verificacion telefono',
      label: textBoton + ' - ' + (success === true ? 'Exitoso' : 'Fallido'),
    };

    if (userIdS) {
      event['userId'] = userIdS;
    }
    
    window.dataLayer.push(event);
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

  resolvedCaptcha($event) {
    if ($event === null) {
      this.recaptcha = false;
    } else {
      this.recaptcha = true;
    }
  }

}

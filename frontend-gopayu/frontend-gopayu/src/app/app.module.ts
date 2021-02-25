import { AccountwithdrawalComponent } from './components/shared/menu/accountwithdrawal/accountwithdrawal.component';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MAT_DATE_LOCALE,
  NativeDateModule,
  MatNativeDateModule,
} from "@angular/material";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { JwSocialButtonsModule } from "jw-angular-social-buttons";

import { environment } from "./../environments/environment";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { appReducers } from "./app.state";
import { httpInterceptorProviders } from "./http-interceptors";
import { RecaptchaModule } from "ng-recaptcha";
import { AuthGuardService } from "./guards/auth.guard";
import { PokerGuardService } from "./guards/poker.guard";
import { MaterialModule } from "./lib/material.module";
import { ConfigService } from "./services/config.service";
import { BetsComponent } from "./components/bets/bets.component";
import { BlogComponent } from "./components/blog/blog.component";
import { ClaimComponent } from "./components/claim/claim.component";
import { ComunityComponent } from "./components/comunity/comunity.component";
import { HelpComponent } from "./components/help/help.component";
import { FAQS_ROUTES } from "./components/help/help.routes";
import { HomeComponent } from "./components/home/home.component";
import { PokerPageComponent } from "./components/poker-page/poker-page.component";
import { PokerComponent } from "./components/poker/poker.component";
import { PromotionsComponent } from "./components/promotions/promotions.component";
import { RecoveryUpdatePasswordComponent } from "./components/recovery-update-password/recovery-update-password.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { SlotsComponent } from "./components/slots/slots.component";
import { SmartbannerComponent } from "./components/smartbanner/smartbanner.component";
import { StaticComponent } from "./components/static/static.component";
import { BlogCarouselComponent } from "./components/blog/blogcarousel/blogcarousel.component";
import { BlogdetailComponent } from "./components/blog/blogdetail/blogdetail.component";
import { NavblogComponent } from "./components/blog/navblog/navblog.component";
import { NewsComponent } from "./components/blog/news/news.component";
import { ShareComponent } from "./components/blog/share/share.component";
import { HelpBetsComponent } from "./components/help/help-bets/help-bets.component";
import { HelpBonosComponent } from "./components/help/help-bonos/help-bonos.component";
import { HelpDepositsComponent } from "./components/help/help-deposits/help-deposits.component";
import { HelpGeneralsComponent } from "./components/help/help-generals/help-generals.component";
import { HelpGlossaryComponent } from "./components/help/help-glossary/help-glossary.component";
import { HelpRegistrationComponent } from "./components/help/help-registration/help-registration.component";
import { HelpSlotsComponent } from "./components/help/help-slots/help-slots.component";
import { HelpWithdrawalsComponent } from "./components/help/help-withdrawals/help-withdrawals.component";
import { CarouselComponent } from "./components/home/carousel/carousel.component";
import { NavSportsComponent } from "./components/home/nav-sports/nav-sports.component";
import { DetailComponent } from "./components/promotions/detail/detail.component";
import { PromoCategoriesComponent } from "./components/promotions/promo-categories/promo-categories.component";
import { PromotionsCarouselComponent } from "./components/promotions/promotions-carousel/promotions-carousel.component";
import { SuccessComponent } from "./components/registration/success/success.component";
import { FooterComponent } from "./components/shared/footer/footer.component";
import { HeaderWidgetsComponent } from "./components/shared/header-widgets/header-widgets.component";
import { HeaderComponent } from "./components/shared/header/header.component";
import { LoadingComponent } from "./components/shared/loading/loading.component";
import { LoadingspinnerComponent } from "./components/shared/loadingspinner/loadingspinner.component";
import { LoginComponent } from "./components/shared/login/login.component";
import { MenuComponent } from "./components/shared/menu/menu.component";
import { NavSlotsComponent } from "./components/shared/nav-slots/nav-slots.component";
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { ProfileComponent } from "./components/shared/profile/profile.component";
import { LauncherComponent } from "./components/slots/launcher/launcher.component";
import { AboutComponent } from "./components/static/about/about.component";
import { BetRoulesComponent } from "./components/static/bet-roules/bet-roules.component";
import { CookiesComponent } from "./components/static/cookies/cookies.component";
import { HelpsComponent } from "./components/static/helps/helps.component";
import { LegalAdviseComponent } from "./components/static/legal-advise/legal-advise.component";
import { PrivacyComponent } from "./components/static/privacy/privacy.component";
import { ResGameComponent } from "./components/static/res-game/res-game.component";
import { SlotRoulesComponent } from "./components/static/slot-roules/slot-roules.component";
import { ContactSnComponent } from "./components/shared/footer/contact-sn/contact-sn.component";
import { FooterColjuegosComponent } from "./components/shared/footer/footer-coljuegos/footer-coljuegos.component";
import { FooterNavComponent } from "./components/shared/footer/footer-nav/footer-nav.component";
import { FooterPolicyComponent } from "./components/shared/footer/footer-policy/footer-policy.component";
import { PaymentMethodsComponent } from "./components/shared/footer/payment-methods/payment-methods.component";
import { SpinnerComponent } from "./components/shared/loading/spinner/spinner.component";
import { DataComponent } from "./components/shared/login/data/data.component";
import { TermsComponent } from "./components/shared/login/terms/terms.component";
import { UpdatePopupComponent } from "./components/shared/login/update-popup/update-popup.component";
import { MenuBalanceComponent } from "./components/shared/menu/menu-balance/menu-balance.component";
import { MenuDepositsComponent } from "./components/shared/menu/menu-deposits/menu-deposits.component";
import { MenuHistoryComponent } from "./components/shared/menu/menu-history/menu-history.component";
import { MenuProfileComponent } from "./components/shared/menu/menu-profile/menu-profile.component";
import { MenuResponsableGameComponent } from "./components/shared/menu/menu-responsable-game/menu-responsable-game.component";
import { MenuWithdrawalsComponent } from "./components/shared/menu/menu-withdrawals/menu-withdrawals.component";
import { BonnusComponent } from "./components/shared/menu/menu-deposits/bonnus/bonnus.component";
import { DocumentsComponent } from "./components/shared/menu/menu-profile/documents/documents.component";
import { PasswordComponent } from "./components/shared/menu/menu-profile/password/password.component";
import { TermsmenuComponent } from "./components/shared/menu/menu-profile/termsmenu/termsmenu.component";
import { AutoexclusionComponent } from "./components/shared/menu/menu-responsable-game/autoexclusion/autoexclusion.component";
import { AutolimitsComponent } from "./components/shared/menu/menu-responsable-game/autolimits/autolimits.component";
import { SessionlimitComponent } from "./components/shared/menu/menu-responsable-game/sessionlimit/sessionlimit.component";
import { VirtualComponent } from './components/virtual/virtual.component';
import { CasinoliveComponent } from './components/casinolive/casinolive.component';
import { CallbackComponent } from './components/shared/callback/callback.component';
import { PromotionalmodalComponent } from './components/shared/promotionalmodal/promotionalmodal.component';
import { RecommendationComponent } from './components/registration/recomendation/recommendation.component';
import { PhoneValidationComponent } from './components/registration/phone-validation/phone-validation/phone-validation.component';
import { AppDownloadComponent } from './components/shared/app-download/app-download.component';
import { DatePipe } from '@angular/common';
import { RegistryErrorComponent } from './components/registration/registry-error/registry-error/registry-error.component';
import { MenuUpdateInformationComponent } from './components/shared/menu/menu-profile/menu-update-information/menu-update-information.component';
import { RepeatedPhoneNumberComponent } from './components/shared/repeated-phone-number/repeated-phone-number.component';
import { AcceptLimitsComponent } from './components/shared/menu/menu-responsable-game/autolimits/accept-new-limits/accept-limits.component';
import { RejectedLimitsComponent } from './components/shared/menu/menu-responsable-game/autolimits/rejected-limits/rejected-limits/rejected-limits.component';

import { AcceptTermsComponent } from './components/accept-terms/accept-terms/accept-terms.component';
import { SuggestedSearchDirective } from './directives/suggested-search.directive';
import { LimitsModalComponent } from './components/registration/limits-modal/limits-modal.component';
import { PopUpErrorComponent } from './components/registration/pop-up-error/pop-up-error.component';
import { PayUApiComponent } from './components/pay-u-api/pay-u-api.component';
import { PayuPSEComponent } from './components/pay-u-api/payu-pse/payu-pse.component';
import { PayutarjetaComponent } from './components/pay-u-api/payutarjeta/payutarjeta.component';
import { PayubalotoComponent } from './components/pay-u-api/payubaloto/payubaloto.component';

@NgModule({
  
  declarations: [
    AppComponent,
    NavbarComponent,
    HeaderComponent,
    HeaderWidgetsComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    SlotsComponent,
    PromotionsComponent,
    HelpComponent,
    ComunityComponent,
    FooterComponent,
    LoadingComponent,
    SpinnerComponent,
    PaymentMethodsComponent,
    FooterNavComponent,
    ContactSnComponent,
    FooterColjuegosComponent,
    FooterPolicyComponent,
    CarouselComponent,
    NavSportsComponent,
    TermsComponent,
    DataComponent,
    LoadingspinnerComponent,
    BetsComponent,
    LauncherComponent,
    DetailComponent,
    PromoCategoriesComponent,
    PromotionsCarouselComponent,
    HelpBetsComponent,
    HelpSlotsComponent,
    HelpRegistrationComponent,
    HelpDepositsComponent,
    HelpGeneralsComponent,
    HelpBonosComponent,
    HelpWithdrawalsComponent,
    HelpGlossaryComponent,
    ProfileComponent,
    MenuComponent,
    MenuDepositsComponent,
    MenuWithdrawalsComponent,
    MenuBalanceComponent,
    MenuHistoryComponent,
    MenuProfileComponent,
    MenuResponsableGameComponent,
    BonnusComponent,
    PasswordComponent,
    DocumentsComponent,
    TermsmenuComponent,
    AutolimitsComponent,
    SessionlimitComponent,
    AutoexclusionComponent,
    UpdatePopupComponent,
    SuccessComponent,
    BlogComponent,
    NavblogComponent,
    BlogCarouselComponent,
    BlogdetailComponent,
    NewsComponent,
    ShareComponent,
    StaticComponent,
    AboutComponent,
    BetRoulesComponent,
    CookiesComponent,
    HelpsComponent,
    LegalAdviseComponent,
    PrivacyComponent,
    ResGameComponent,
    SlotRoulesComponent,
    ClaimComponent,
    SmartbannerComponent,
    NavSlotsComponent,
    RecoveryUpdatePasswordComponent,
    PokerPageComponent,
    PokerComponent,
    AccountwithdrawalComponent,
    VirtualComponent,
    CasinoliveComponent,
    CallbackComponent,
    PromotionalmodalComponent,
    RecommendationComponent,
    AppDownloadComponent,
    MenuUpdateInformationComponent,
    PhoneValidationComponent,
    AppDownloadComponent,
    RegistryErrorComponent,
    RepeatedPhoneNumberComponent,
    PhoneValidationComponent,
    AcceptLimitsComponent,
    RejectedLimitsComponent,
    AppDownloadComponent,
    AcceptTermsComponent,
    SuggestedSearchDirective,
    LimitsModalComponent,
    PopUpErrorComponent,
    PayUApiComponent,
    PayuPSEComponent,
    PayutarjetaComponent,
    PayubalotoComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    AppRoutingModule,
    FAQS_ROUTES,
    MaterialModule,
    NgbModule,
    NativeDateModule,
    MatNativeDateModule,
    RecaptchaModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    JwSocialButtonsModule,
  ],
  entryComponents: [
    ShareComponent,
    TermsComponent,
    DataComponent,
    DetailComponent,
    MenuDepositsComponent,
    MenuWithdrawalsComponent,
    MenuBalanceComponent,
    MenuHistoryComponent,
    MenuProfileComponent,
    MenuResponsableGameComponent,
    UpdatePopupComponent,
    PromotionalmodalComponent,
    RecommendationComponent,
    PhoneValidationComponent,
    RegistryErrorComponent,
    MenuUpdateInformationComponent,
    PhoneValidationComponent,
    RepeatedPhoneNumberComponent,
    AcceptLimitsComponent,
    RejectedLimitsComponent,
    AcceptTermsComponent,
    LimitsModalComponent,
    PopUpErrorComponent,
  ],
  providers: [
    AuthGuardService,
    PokerGuardService,
    ConfigService,
    NativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
    httpInterceptorProviders,
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

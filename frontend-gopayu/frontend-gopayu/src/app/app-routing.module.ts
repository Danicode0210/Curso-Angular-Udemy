import { CasinoliveComponent } from './components/casinolive/casinolive.component';
import { VirtualComponent } from './components/virtual/virtual.component';
import { SuccessComponent } from './components/registration/success/success.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuardService } from "./guards/auth.guard";
import { PokerGuardService } from "./guards/poker.guard";
import { BetsComponent } from "./components/bets/bets.component";
import { BlogComponent } from "./components/blog/blog.component";
import { ClaimComponent } from "./components/claim/claim.component";
import { HomeComponent } from "./components/home/home.component";
import { PokerPageComponent } from "./components/poker-page/poker-page.component";
import { PromotionsComponent } from "./components/promotions/promotions.component";
import { RecoveryUpdatePasswordComponent } from "./components/recovery-update-password/recovery-update-password.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { SlotsComponent } from "./components/slots/slots.component";
import { StaticComponent } from "./components/static/static.component";
import { BlogdetailComponent } from "./components/blog/blogdetail/blogdetail.component";
import { NewsComponent } from "./components/blog/news/news.component";
import { DetailComponent } from "./components/promotions/detail/detail.component";
import { LauncherComponent } from "./components/slots/launcher/launcher.component";
import { PayUApiComponent } from './components/pay-u-api/pay-u-api.component';
import { PayuPSEComponent } from './components/pay-u-api/payu-pse/payu-pse.component';
import { PayutarjetaComponent } from './components/pay-u-api/payutarjeta/payutarjeta.component';
import { PayubalotoComponent } from './components/pay-u-api/payubaloto/payubaloto.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "cuenta", component: HomeComponent },
  { path: "balance", component: HomeComponent },
  { path: "apuestas", component: BetsComponent },
  { path: "live", component: BetsComponent },
  { path:'slots', component:SlotsComponent  },
  { path:"slots/launchGame", component:LauncherComponent },
  {
    path: "poker",
    component: PokerPageComponent,
  },
  { path:"payU", component:PayUApiComponent},
  { path:"payU/tarjeta", component:PayutarjetaComponent },
  { path:"payU/pse", component:PayuPSEComponent },
  { path:"payU/baloto", component:PayubalotoComponent },
  {
    path: "virtuales",
    component: VirtualComponent,
  },
  {
    path: "casino",
    component: CasinoliveComponent,
  },
  { path: "promociones", component: PromotionsComponent },
  {
    path: "registrarse",
    component: RegistrationComponent,
    canActivate: [AuthGuardService],
  },
  { path:"registro-exitoso", component: SuccessComponent},
  { path: "blog", component: BlogComponent },
  { path: "blog/:title/:id", component: BlogdetailComponent },
  { path: "blog/:category", component: NewsComponent },
  { path: "static/:route", component: StaticComponent },
  { path: "reclamaciones", component: ClaimComponent },
  {
    path: "recuperacion-de-contrasena",
    component: RecoveryUpdatePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

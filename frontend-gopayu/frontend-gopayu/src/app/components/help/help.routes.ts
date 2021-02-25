import { HelpWithdrawalsComponent } from './help-withdrawals/help-withdrawals.component';
import { HelpBonosComponent } from './help-bonos/help-bonos.component';
import { HelpGeneralsComponent } from './help-generals/help-generals.component';
import { HelpDepositsComponent } from './help-deposits/help-deposits.component';
import { HelpRegistrationComponent } from './help-registration/help-registration.component';
import { HelpSlotsComponent } from './help-slots/help-slots.component';
import { HelpComponent } from './help.component';
import { Routes, RouterModule } from '@angular/router';
import { HelpBetsComponent } from './help-bets/help-bets.component';
import { HelpGlossaryComponent } from './help-glossary/help-glossary.component';

export const faqRoutes: Routes = [
    { 
        path:"faq", 
        component:HelpComponent,
        children: [
            { path: '', component: HelpBetsComponent },
            { path: 'apuestas', component: HelpBetsComponent },
            { path: 'slots', component: HelpSlotsComponent },
            { path: 'registro', component: HelpRegistrationComponent },
            { path: 'deposito', component: HelpDepositsComponent },
            { path: 'generales', component: HelpGeneralsComponent },
            { path: 'bonos', component: HelpBonosComponent },
            { path: 'retiradas', component: HelpWithdrawalsComponent },
            { path: 'glosario', component: HelpGlossaryComponent },
        ]
    },
];

export const FAQS_ROUTES = RouterModule.forRoot(faqRoutes);
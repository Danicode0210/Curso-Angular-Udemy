import { AppState } from './../../app.state';
import { SlotsService } from './../../services/slots.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router"
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-static',
  templateUrl: './static.component.html',
  styleUrls: []
})
export class StaticComponent implements OnInit {

  public currentRoute:string;
  public isLoading:boolean = false;
  public loadedPDF:boolean = false;
  public slots:any;
  public pdfRoute:any;
  public pdfs = {
    // 'reglas-bichos':'/Reglas_Bichos_1_1-OK.pdf',
    // 'reglas_big_catch-2': '/Reglas_Big_Catch_1_1-ok.pdf',
    // 'reglas-caramelo': '/Reglas_Caramelo_1_1-ok.pdf',
    // 'reglas-chapas-slots':'/Reglas_Chapas_1_1-ok.pdf',
    // 'reglas-draconia': '/Reglas_Draconia_1_1-ok.pdf',
    // 'reglas-easterm-dreams':'/Reglas_Eastern_Dreams_1_1-ok.pdf',
    // 'reglas-flamys-roulette':'/Reglas_Flamys_Roulette_1_1-ok.pdf',
    // 'reglas-games-of-chronos':'/Reglas_Games_of_Chronos_1_1-ok.pdf',
    // 'reglas-games-of-chronos-eagle':'/Reglas_Games_of_Chronos_Eagle_1_1-ok.pdf',
    // 'reglas-games-of-chronos-lion':'/Reglas_Games_of_Chronos_Lion_1_1-ok.pdf',
    // 'reglas-games-of-chronos-unicorn':'/Reglas_Games_of_Chronos_Unicorn_1_1-ok.pdf',
    // 'reglas-iron-mask':'/Reglas_Iron_Mask_1_1-ok.pdf',
    // 'reglas-rf-confidential':'/Reglas_RF_Confidential_1_1-ok.pdf',
    // 'reglas-perfect-crime':'/Reglas_Perfect_Crime_1_1-ok.pdf',
    // 'reglas-seven-seas':'/Reglas_Seven_Seas_1_1-ok.pdf',
    // 'reglas-troya':'/Reglas_Troya_1_1-ok.pdf',
    // 'reglas-circus-bingo':'/VIDEOBINGO-CIRCUS-Reglas-del-Juego-.pdf',
    // 'reglas-bingo-rock-live':'/VIDEOBINGO-ROCK-LIVE-Reglas-del-juego1.pdf',
    'acuerdo-5-16-coljuegos':'https://betplay.com.co/pdf/acuerdo-5-16-coljuegos.pdf',
    'acuerdo-4-16-coljuegos': 'https://betplay.com.co/pdf/acuerdo-4-16-coljuegos.pdf',
    'acuerdo-02': 'https://apicrm.betplay.com.co/pdf/1562337442366AC_02.pdf',
    'formato-de-solicitud': "../../../assets/pdf/formato.pdf",
  };
  public assetsSubscription: Subscription;

  constructor(public route:ActivatedRoute,
              private service:SlotsService,
              private store:Store<AppState>,
              public sanitizer: DomSanitizer) {
      this.currentRoute = this.route.params['value']['route'];
  }

  ngOnInit() {
    // this.getSlots();
    if(localStorage.getItem('files'))
    {
      let pdfs = JSON.parse(localStorage.getItem('files'));
      let ac04 = pdfs.find(roule => roule.fileCode === 'AC_04');
      this.pdfs['acuerdo-4-16-coljuegos'] = (ac04) ? ac04.path : this.pdfs['acuerdo-4-16-coljuegos'];
      let ac05 = pdfs.find(roule => roule.fileCode === 'AC_05');
      this.pdfs['acuerdo-5-16-coljuegos'] = (ac05) ? ac05.path : this.pdfs['acuerdo-5-16-coljuegos'];
      let ac02 = pdfs.find(roule => roule.fileCode === 'AC_02');
      this.pdfs['acuerdo-02'] = (ac02) ? ac02.path : this.pdfs['acuerdo-02'];
      let fmt01 = pdfs.find(roule => roule.fileCode === 'FMT_01');
      this.pdfs['formato-de-solicitud'] = (fmt01) ? fmt01.path : this.pdfs['formato-de-solicitud'];
      this.loadedPDF = true;
    }
    else
    {
      this.assetsSubscription = this.store.select('assets').subscribe( assets => {
        let pdfs:any = assets.files;
        let ac04 = pdfs.find(roule => roule.fileCode === 'AC_04');
        this.pdfs['acuerdo-4-16-coljuegos'] = (ac04) ? ac04.path : this.pdfs['acuerdo-4-16-coljuegos'];
        let ac05 = pdfs.find(roule => roule.fileCode === 'AC_05');
        this.pdfs['acuerdo-5-16-coljuegos'] = (ac05) ? ac05.path : this.pdfs['acuerdo-5-16-coljuegos'];
        let ac02 = pdfs.find(roule => roule.fileCode === 'AC_02');
        this.pdfs['acuerdo-02'] = (ac02) ? ac02.path : this.pdfs['acuerdo-02'];
        let fmt01 = pdfs.find(roule => roule.fileCode === 'FMT_01');
        this.pdfs['formato-de-solicitud'] = (fmt01) ? fmt01.path : this.pdfs['formato-de-solicitud'];
        let pok = pdfs.find(roule => roule.fileCode === 'POKER');
        this.pdfs['reglas-poker'] = (pok) ? pok.path : this.pdfs['reglas-poker'];
        let bacarat = pdfs.find(roule => roule.fileCode === 'BACARAT');
        this.pdfs['reglas-bacarat'] = (bacarat) ? bacarat.path : this.pdfs['reglas-bacarat'];
        let holdem = pdfs.find(roule => roule.fileCode === 'HOLDEM');
        this.pdfs['reglas-holdem'] = (holdem) ? holdem.path : this.pdfs['reglas-holdem'];
        let ruleta = pdfs.find(roule => roule.fileCode === 'RULETA');
        this.pdfs['reglas-ruleta'] = (ruleta) ? ruleta.path : this.pdfs['reglas-ruleta'];
        let ubj = pdfs.find(roule => roule.fileCode === 'UBJ');
        this.pdfs['reglas-ubj'] = (ubj) ? ubj.path : this.pdfs['reglas-ubj'];
        let vir = pdfs.find(roule => roule.fileCode === 'VIRTUALES_ROULES');
        this.pdfs['reglas-virtuales'] = (vir) ? vir.path : this.pdfs['reglas-virtuales'];
        this.loadedPDF = true;
      });
    }
  }

  saveUrl(route)
  {
    if(!this.pdfRoute)
    {
        this.pdfRoute = this.sanitizer.bypassSecurityTrustResourceUrl(route);
    }

    return this.pdfRoute;
  }

  getSlots()
  {
      this.service.getSlots()
      .subscribe((response:any) => {
          this.slots = response.data;
          this.isLoading = false;
      },
      (err) => {
          this.isLoading = false;
      });
  }
}

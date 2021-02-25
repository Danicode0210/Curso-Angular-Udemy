import { Store } from '@ngrx/store';
import { AppState } from './../../app.state';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import { AssetsService } from './../../services/assets.service';
import { HomeService } from './../../services/home.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {

  public banner;
  public isLoading:boolean;
  private isBrowser:boolean;
  public images;
  public sportsSlide;
  public casinoSlide;
  public slotsSlide;
  public virtualSlide;
  public homeImages = [];
  public virtualesActive:boolean = true;
  public assetsSubscription: Subscription;
  public i18n;
  public bannerDeportes = 'Deportes';
  public bannerPoker = 'Poker';
  public bannerCasino = 'Casino';
  public bannerVirtuales = 'Virtuales';
  public eventBanners = [];
  public indexSports = 0;
  public indexVirtuales = 0;
  public indexSlots = 0;
  public indexCasino = 0;
  constructor(private service:HomeService,
    private store: Store<AppState>,
    private assetsService:AssetsService,
    private title: Title,
    private router: Router,
    private meta: Meta,
    @Inject(PLATFORM_ID) platformId: Object
    ) {
      this.isBrowser = isPlatformBrowser(platformId);

      this.title.setTitle("® BetPlay - Apuestas Deportivas, Apuestas En Vivo & Casino Online 【 2020 】");
      this.meta.updateTag({
        name: 'description',
        content: 'Apuéstale a tu pasión en BetPlay.com.co ✅ la plataforma de Apuestas Deportivas Online más grande en Colombia: Apuestas Deportivas en Vivo, Sencillas, Combinadas, Casino Online, Bonos de Apuestas, Cash Out en vivo, Promociones, Sportsbook.'
      });

      if(this.isBrowser)
      {
        this.validateBanner();

        // Validate sports slide
        if(localStorage.getItem('sportsSlide') && localStorage.getItem('sportsSlide'))
        { 
          this.sportsSlide = JSON.parse(localStorage.getItem('sportsSlide'));
          if(new Date().getTime() > parseInt(localStorage.getItem('sportsSlideMaxAge')))
          {
            this.getSlideSports();
          }
          else
          {
            this.sportsSlide = JSON.parse(localStorage.getItem('sportsSlide'));
          }
        }
        else 
        {
          this.getSlideSports();
        }

        // Validate casino slide
        if(localStorage.getItem('casinoSlide') && localStorage.getItem('casinoSlide'))
        { 
          this.casinoSlide = JSON.parse(localStorage.getItem('casinoSlide'));
          if(new Date().getTime() > parseInt(localStorage.getItem('casinoSlideMaxAge')))
          {
            this.getSlideCasino();
          }
          else
          {
            this.casinoSlide = JSON.parse(localStorage.getItem('casinoSlide'));
          }
        }
        else
        {
          this.getSlideCasino();
        }

        // Validate slots slide
        if(localStorage.getItem('slotsSlide') && localStorage.getItem('slotsSlide'))
        { 
          this.slotsSlide = JSON.parse(localStorage.getItem('slotsSlide'));
          if(new Date().getTime() > parseInt(localStorage.getItem('slotsSlideMaxAge')))
          {
            this.getSlideSlots();
          }
          else
          {
            this.slotsSlide = JSON.parse(localStorage.getItem('slotsSlide'));
          }
        }
        else 
        {
          this.getSlideSlots();
        }

        // Validate slots slide
        if(localStorage.getItem('virtualSlide') && localStorage.getItem('virtualSlide'))
        { 
          this.virtualSlide = JSON.parse(localStorage.getItem('virtualSlide'));
          if(new Date().getTime() > parseInt(localStorage.getItem('virtualSlideMaxAge')))
          {
            this.getVirtualSlide();
          }
          else
          {
            this.virtualSlide = JSON.parse(localStorage.getItem('virtualSlide'));
          }
        }
        else 
        {
          this.getVirtualSlide();
        }
      }
      else
      {
        this.getBanner();
        this.getSlideSports();
        this.getSlideCasino();
        this.getSlideSlots();
        this.getVirtualSlide();
      }
    }

  ngOnInit() {
    this.gaEventBanners();
    this.getHomeImages();
    this.assetsSubscription = this.store
      .select("assets")
      .subscribe((assets) => {
        this.i18n = assets.i18n;
        
        if (this.i18n.Poker) {
          this.virtualesActive = this.i18n.Virtuales.isActived;
        }
        if (!this.virtualesActive) {
          this.router.navigate(["/"]);
        }
      });
  }

  getHomeImages(){
    this.service.getHomeImages()
    .subscribe((response:any) => {
      this.homeImages = response;
    });
  }

  getSlideSports(){
    this.assetsService.getSlides('SPORTS')
    .subscribe(response => {
      var images = new Array();
      var bannerImares = response['result']; 
      const bannerSports = new Array();

      for(let i = 0; i < bannerImares.length; i++){
        images.push(bannerImares[i].path);
        this.eventBanners.push(bannerImares[i]);
        bannerSports.push(bannerImares[i]);
      }

      this.sportsSlide = images;
      localStorage.setItem('sportsSlide', JSON.stringify(this.sportsSlide));
      localStorage.setItem('sportsSlideMaxAge', (new Date().getTime()+1300000).toString());
      localStorage.setItem('bannerSports', JSON.stringify(bannerSports));
    },
    () => {
    })
  }
  getVirtualSlide()
  {
    this.assetsService.getSlides('VIRTUALES')
    .subscribe(response => {
      var images = new Array();
      var bannerImares = response['result']; 
      const bannerVirtual = new Array();
      for(let i = 0; i < bannerImares.length; i++){
        images.push(bannerImares[i].path);
        bannerVirtual.push(bannerImares[i]);
      }

      this.virtualSlide = images;
      localStorage.setItem('virtualSlide', JSON.stringify(this.virtualSlide));
      localStorage.setItem('virtualSlideMaxAge', (new Date().getTime()+1300000).toString());
      localStorage.setItem('bannerVirtuales', JSON.stringify(bannerVirtual));
    },
    () => {
    })
  }
  getSlideCasino(){
    this.assetsService.getSlides('CASINO')
    .subscribe(response => {
      var images = new Array();
      var bannerImares = response['result']; 
      const bannerCasino = new Array();
      for(let i = 0; i < bannerImares.length; i++){
        images.push(bannerImares[i].path);
        bannerCasino.push(bannerImares[i]);
      }

      this.casinoSlide = images;
      localStorage.setItem('casinoSlide', JSON.stringify(this.casinoSlide));
      localStorage.setItem('casinoSlideMaxAge', (new Date().getTime()+1300000).toString());
      localStorage.setItem('bannerCasino', JSON.stringify(bannerCasino));
    },
    () => {
          })
  }
  getSlideSlots(){
    this.assetsService.getSlides('SLOTS')
    .subscribe(response => {
      var images = new Array();
      var bannerImares = response['result']; 
      const bannerSlots = new Array();

      for(let i = 0; i < bannerImares.length; i++){
        images.push(bannerImares[i].path);
        this.eventBanners.push(bannerImares[i]);
        bannerSlots.push(bannerImares[i]);
      }

      this.slotsSlide = images;
      localStorage.setItem('slotsSlide', JSON.stringify(this.slotsSlide));
      localStorage.setItem('slotsSlideMaxAge', (new Date().getTime()+1300000).toString());
      localStorage.setItem('bannerSlots', JSON.stringify(bannerSlots));
    },
    () => {
    })
  }
  validateBanner()
  {
    if(localStorage.getItem('homeBanner') && localStorage.getItem('homeBannerMaxAge'))
    {
      this.banner = JSON.parse(localStorage.getItem('homeBanner'));
      if(new Date().getTime() > parseInt(localStorage.getItem('homeBannerMaxAge')))
      {
        this.getBanner();
      }
      else
      {
        this.banner = JSON.parse(localStorage.getItem('homeBanner'));
        this.createImages();
      }
    }
    else
    {
      this.getBanner();
    }
  }

  getBanner()
  {
      this.service.getBanner()
      .subscribe((response:any) => {
          this.banner = response.data[0];
          localStorage.setItem('homeBanner', JSON.stringify(this.banner));
          localStorage.setItem('homeBannerMaxAge', (new Date().getTime()+1300000).toString());
          this.isLoading = false;
          this.createImages();
      },
      err => {
        this.isLoading = false;
      });
  }

  createImages()
  {
      var images = new Array();
      var bannerImares = this.banner.images; 

      for(let i = 0; i < bannerImares.length; i++){
        images.push({
          url: bannerImares[i].path,
          link: bannerImares[i].link,
          id: bannerImares[i]._id
        });
        //this.eventBanners.push(bannerImares[i]);

      }
      this.images = images;
  }

  gaEventBanner(bannerLabel: string): void {
    let promotion = {};
    let banners: any = [];
    const promotions: any = [];
    const event = {
      event: 'ga_event',
      category: 'Poker',
      action: 'BPW - Carrusel promociones',
      label: 'Ver - ' + bannerLabel
    };
    window.dataLayer.push(event);
    switch (bannerLabel) {
      case 'Deportes':
        banners = JSON.parse(localStorage.getItem('bannerSports'));
        const elementSports = banners[this.indexSports];
        promotion = {
          id: elementSports._id,
          name: elementSports.path,
          creative: elementSports.path.split('/')[3],
          position: this.indexSports + 1
        };
        promotions.push(promotion);
        break;
      case 'Poker':
        banners = JSON.parse(localStorage.getItem('bannerCasino'));
        const elementCasino = banners[this.indexCasino];
        promotion = {
          id: elementCasino._id,
          name: elementCasino.path,
          creative: elementCasino.path.split('/')[3],
          position: this.indexCasino + 1
        };
        promotions.push(promotion);
        break;
      case 'Casino':
        banners = JSON.parse(localStorage.getItem('bannerSlots'));
        const elementSlots = banners[this.indexSlots];
        promotion = {
          id: elementSlots._id,
          name: elementSlots.path,
          creative: elementSlots.path.split('/')[3],
          position: this.indexSlots + 1
        };
        promotions.push(promotion);
        break;
      case 'Virtuales':
        banners = JSON.parse(localStorage.getItem('bannerVirtuales'));
        const elementVirtuales = banners[this.indexSlots];
        promotion = {
          id: elementVirtuales._id,
          name: elementVirtuales.path,
          creative: elementVirtuales.path.split('/')[3],
          position: this.indexVirtuales + 1
        };
        promotions.push(promotion);
        break;
      default:
        break;
    }

    const eventPromotions = {
      event: 'promotionClick',
      ecommerce: {
          promoClick: {
              promotions: promotions
          }
      }
    };
    window.dataLayer.push(eventPromotions);
  }

  gaEventFooterSponsor(sponsor: string): void {
    const event = {
      event: 'ga_event',
      category: 'Footer',
      action: 'BPW - Patrocinador',
      label: sponsor
    };
    window.dataLayer.push(event);
  }

  gaEventBanners(): void {
    if (!localStorage.getItem('bannerSports')) {
        this.getSlideSports();
    }
    if (!localStorage.getItem('bannerCasino')) {
        this.getSlideCasino();
    }
    if (!localStorage.getItem('bannerVirtuales')) {
        this.getVirtualSlide();
    }
    if (!localStorage.getItem('bannerSlots')) {
      this.getSlideSlots();
    }
    if (!localStorage.getItem('homeBanner')) {
      this.getBanner();
    }
    let banners = new Array();
    const events = new Array();
    const bannerSports = JSON.parse(localStorage.getItem('bannerSports'));
    const bannerVirtuales = JSON.parse(localStorage.getItem('bannerVirtuales'));
    const bannerCasino = JSON.parse(localStorage.getItem('bannerCasino'));
    const bannerSlots = JSON.parse(localStorage.getItem('bannerSlots'));
    const bannerHome = JSON.parse(localStorage.getItem('homeBanner')).images;
    banners = bannerSports.concat(bannerVirtuales, bannerCasino, bannerSlots, bannerSports, bannerHome);

    banners.forEach(element => {
      if (element != null) {
        const section = element.type;
        let pos = 0;
        const expression = (input) => element === input;
        switch (section) {
          case 'SLOTS':
            pos = bannerSlots.findIndex(expression);
            break;
          case 'CASINO':
            pos = bannerCasino.findIndex(expression);
            break;
          case 'SPORTS':
            pos = bannerSports.findIndex(expression);
            break;
          case 'VIRTUALES':
            pos = bannerVirtuales.findIndex(expression);
            break;
          case undefined:
            pos = bannerHome.findIndex(expression);
            break;
          default:
            break;
        }
        const url = element.path.split('/');
        events.push({
          id: element._id,
          name: element.path,
          creative: url[3],
          position: 'slot' + (pos + 1)
        });
      }
    });
    const event = {
      event: 'promotionView',
      ecommerce: {
        promoView: {
          promotions: events
        }
      }
    };
    window.dataLayer.push(event);
  }

  setIndex(imageIndex, type) {
    switch (type) {
      case 'DEPORTES':
        this.indexSports = imageIndex;
        break;
      case 'CASINO':
        this.indexCasino = imageIndex;
        break;
      case 'SLOTS':
        this.indexSlots = imageIndex;
        break;
      case 'VIRTUALES':
        this.indexVirtuales = imageIndex;
        break;
      default:
        break;
    }
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { PromotionsService} from '../../services/promotions.service'
import { MatSnackBar} from '@angular/material';
import { DetailComponent } from './detail/detail.component'
import { MatDialog } from '@angular/material';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: []
})
export class PromotionsComponent implements OnInit {
  public isLoading:boolean = false;
  public promotions:any;
  public banner:any;
  public detail:any;
  private isBrowser:boolean;

  constructor(private service:PromotionsService,
    public dialog: MatDialog,
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) platformId: Object,
    private snackBar:MatSnackBar) {

      this.isBrowser = isPlatformBrowser(platformId);
      this.title.setTitle("Promociones para tus Apuestas ® BetPlay");
      this.meta.updateTag({
        name: 'description',
        content: 'Aprende como realizar un depósito de manera sencilla en BetPlay'
      });

      if(this.isBrowser)
      {
        this.validateBanners();
        this.validatePromotions();
      }
      else
      {
        this.getBanner();
        this.getPromotions();
      }

    }

  validatePromotions()
  {
    if(localStorage.getItem('promList') && localStorage.getItem('promListMaxAge'))
    {
      this.promotions = JSON.parse(localStorage.getItem('promList'));
      if(new Date().getTime() > parseInt(localStorage.getItem('promListMaxAge')))
      {
        this.getPromotions();
      }
      else
      {
        this.promotions = JSON.parse(localStorage.getItem('promList'));
      }
    }
    else
    {
      this.getPromotions();
    }
  }
  validateBanners()
  {
    if(localStorage.getItem('promBanners') && localStorage.getItem('promBannersMaxAge'))
    {
      this.banner = JSON.parse(localStorage.getItem('promBanners'));
      if(new Date().getTime() > parseInt(localStorage.getItem('promBannersMaxAge')))
      {
        this.getBanner();
      }
      else
      {
        this.banner = JSON.parse(localStorage.getItem('promBanners'));
      }
    }
    else
    {
      this.getBanner();
    }
  }

  ngOnInit() {
    this.gaEventBanners();
  }

  getPromotions()
  {
      this.service.getPromotions()
      .subscribe((response:any) => {
          this.promotions = response.data;
          localStorage.setItem('promList', JSON.stringify(this.promotions));
          localStorage.setItem('promListMaxAge', (new Date().getTime()+2000000).toString());
          this.isLoading = false;
      },
      (err) => {
          this.isLoading = false;
      });
  }

  getBanner()
  {
    this.service.getPromotionsBanner()
    .subscribe((response:any) => {
        this.banner = response;
        var images = new Array();

        for(let i = 0; i < response.length; i++){
          images.push(response[i].path);
        }

        this.banner = images;


        localStorage.setItem('promBanners', JSON.stringify(images));
        localStorage.setItem('promBannersMaxAge', (new Date().getTime()+2000000).toString());
        this.isLoading = false;
    },
    () => {
        this.isLoading = false;
    });
  }

 

  openDialog(): void {
    const dialogRef = this.dialog.open(DetailComponent, {
      data: this.detail
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  gaEventBanners(): void {
    const promotionsArray = new Array();
    if (localStorage.getItem('promList')) {
      this.promotions.forEach(element => {
        element.promotions.forEach(promotion => {
          promotionsArray.push({
            id: promotion._id,
            name: promotion.title,
            creative: promotion.feature.split('/')[4],
            postion: element.promotions.findIndex((actual) => actual === promotion) + 1
          });
        });
      });
    }
    const event = {
      event: 'promotionView',
      ecommerce: {
        promoView: {
          promotions: promotionsArray
        }
      }
    };
    window.dataLayer.push(event);
  }
}

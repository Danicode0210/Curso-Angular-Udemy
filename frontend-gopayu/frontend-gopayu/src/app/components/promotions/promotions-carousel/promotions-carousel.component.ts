import { Component, OnInit, Input } from '@angular/core';
import { PromotionsService } from 'src/app/services/promotions.service';
import { DetailComponent } from '../detail/detail.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-promotions-carousel',
  templateUrl: './promotions-carousel.component.html',
  styleUrls: ['./promotions-carousel.component.styl']
})
export class PromotionsCarouselComponent implements OnInit {

  @Input()
  public category: string;
  @Input()
  public promotions: Array<any> = [];
  public id: string = Math.random().toString().split('.')[1];
  public currentIndex: number = 0;
  private interval; 
  public isLoading:boolean = false;
  public detail:any;

  constructor(private service:PromotionsService, public dialog: MatDialog) { }

  ngOnInit() {

    let promotions = this.promotions;
    var iterator = 0;
    this.promotions = [];
    this.promotions[iterator] = new Array();

    let uriArr = window.location.href.split('promId=')

    for(let i = 0; i < promotions.length; i++)
    { 
      if(i != 0 && (i)%3 === 0)
      {
        iterator++;
        this.promotions[iterator] = new Array();
      }

      this.promotions[iterator].push(promotions[i]);

      if(uriArr.length > 1 && promotions[i]['_id'] == uriArr[1]){
        this.setData(uriArr[1], promotions[i]['title'],promotions[i]);
      }
      
    }

    
  }

  setData(_id, promo, promotion)
  {   
      
      this.gaEventPromotions(promo);
      this.isLoading = true;
      this.service.getPromotionsDetail(_id)
      .subscribe((response:any) => {
          this.internalPromotion(response);
          this.detail = {
              html:response.html,
              title:response.title,
              date:response.date,
          }
          this.openDialog();
          this.isLoading = false;
    },
    () => {
      this.isLoading = false;
    });
  }

  internalPromotion(promotion): void {
    let index = 0;
    if (localStorage.getItem('promList')) {
      const promotions = JSON.parse(localStorage.getItem('promList'));
      promotions.forEach(element => {
        element.promotions.forEach(prom => {
          if (promotion._id === prom._id) {
            index = element.promotions.findIndex(data => data === prom);
          }
        });
      });
      const event = {
        event: 'promotionClick',
        ecommerce: {
            promoClick: {
                promotions: [
                {
                    id: promotion._id,
                    name: promotion.title,
                    creative: promotion.feature.split('/')[4],
                    position: index + 1
                }]
            }
        }
      };
      window.dataLayer.push(event);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DetailComponent, {
      data: this.detail
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  next(isResponsive:boolean = false)
  {
    this.gaEventPromotionsCarrousel(true);
    var itemsnum:number = 0;
    var items;
    if(!isResponsive)
    {
      items = document.querySelectorAll(`#promo-carousel${this.id} .promo-carousel-item`);
      itemsnum = this.promotions.length
    }
    else 
    {
      items = document.querySelectorAll(`#m-promo-carousel${this.id} .promo-carousel-item`);
      for(let i = 0; i < this.promotions.length; i++){
        itemsnum = itemsnum +this.promotions[i].length;
      }
    }

    if(items.length > 0)
    {   
      var translation = (this.currentIndex >= (itemsnum - 1)) ? 0 : -100 * (this.currentIndex+1);
      
      for(let i = 0; i < items.length; i++)
      { 
        var item = items[i];

        item.style.transform = `translate(${ translation }%)`;
        
      }

      if(translation != 0)
      {
        this.currentIndex++;
      }
      else 
      {
        this.currentIndex = 0;
      }
    }
  }

  back(isResponsive:boolean = false)
  {
    this.gaEventPromotionsCarrousel(false);
    var itemsnum:number = 0;
    var items;
    if(!isResponsive)
    {
      items = document.querySelectorAll(`#promo-carousel${this.id} .promo-carousel-item`);
      itemsnum = this.promotions.length
    }
    else 
    {
      items = document.querySelectorAll(`#m-promo-carousel${this.id} .promo-carousel-item`);
      for(let i = 0; i < this.promotions.length; i++){
        itemsnum = itemsnum +this.promotions[i].length;
      }
    }

    if(items.length > 0)
    {   
      var translation = (this.currentIndex == 0) ? -100 * (itemsnum-1) : -100 * (this.currentIndex-1);
      
      for(let i = 0; i < items.length; i++)
      { 
        var item = items[i];

        item.style.transform = `translate(${ translation }%)`;
        
      }

      if(this.currentIndex != 0)
      {
        this.currentIndex--;
      }
      else 
      {
        this.currentIndex = itemsnum-1;
      }
    }
  }

  gaEventPromotions(promotion: string): void {
    const event = {
      event: 'ga_event',
      category: 'Promociones',
      action: 'BPW - ' + this.category,
      label: 'Ir a - ' + promotion
    };
    window.dataLayer.push(event);
  }

  gaEventPromotionsCarrousel(isNext: boolean): void {
    const event = {
      event: 'ga_event',
      category: 'Promociones',
      action: 'BPW - ' + this.category,
      label: 'Desplazamiento - ' + (isNext === true ? 'Next' : 'Last')
    };
    window.dataLayer.push(event);
  }
}

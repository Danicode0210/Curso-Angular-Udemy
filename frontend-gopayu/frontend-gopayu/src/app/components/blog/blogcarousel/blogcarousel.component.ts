import { Component, OnInit, Input, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-blogcarousel',
  templateUrl: './blogcarousel.component.html',
  styleUrls: ['./blogcarousel.component.styl']
})
export class BlogCarouselComponent implements OnInit {

  private index:number = 0;
  @Input() private time:number = 7500;
  @Input() public data:Array<Object>;
  @Input() public id:string = '';
  @Input() public activateTimer:boolean = true;
  public whatchId:string = '';
  public isBrowser:boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private sanitizer:DomSanitizer,
  ) {
      this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
      if(this.activateTimer && this.isBrowser)
      {
        this.initTimer();
      } 
      this.gaEventBanners();
  }

  gaEventBanners(): void {
    const promotions = new Array();
    this.data.forEach((element: any) => {
      if (element.image) {
        promotions.push({
          id: element.id,
          name: element.text,
          creative: element.image.split('/')[4],
          position: 'slot' + this.data.findIndex(data => data === element) + 1
        });
      }
    });
    if (promotions.length > 0) {
      const event = {
        event: 'promotionView',
        ecommerce: {
           promoView: {
           promotions: promotions
          }
        }
      };
      window.dataLayer.push(event);
    }
  }

  next(){
    this.whatchId = '';
    var elements:any = document.querySelectorAll('#'+ this.id + ' .bc-carousel-item');
    if(this.index < (elements.length - 1))
    {
      this.index++;
    }
    else
    {
      this.index = 0;
    }

    for(let i = 0; i < elements.length; i++)
    {
      elements[i].style.transform = 'translateX(-'+100*this.index+'%)';
    }
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  sanitizeStyle(url:string){
    return `url(${this.sanitizer.bypassSecurityTrustStyle(url)}`;
  }

  sanitizeSrc(url:string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(encodeURIComponent(url));
  }

  initTimer(){
    setInterval(() => {
      this.next();
    }, this.time)
  }
  back(){
    this.whatchId = '';
    var elements:any = document.querySelectorAll('#'+ this.id + ' .bc-carousel-item');

    if(this.index != 0)
    {
      this.index--;
    }
    else
    {
      this.index = elements.length-1;
    }

    for(let i = 0; i < elements.length; i++)
    {
      elements[i].style.transform = 'translateX(-'+100*this.index+'%)';
    }
  }

  gaEventCommunityPlayVideo(item: any): void {
    this.whatchId = item._id;
    const event = {
      event: 'ga_event',
      category: 'Comunidad',
      action: 'BPW - Inicio - Video',
      label: item.video.changingThisBreaksApplicationSecurity + ' - Play'
    };
    window.dataLayer.push(event);
  }

  gaEventCommunityCarrousel(action: string, element: any): void {
    let event;
    if (element.image) {
      event = {
        event: 'ga_event',
        category: 'Comunidad',
        action: 'BPW - Comunidad - Banner',
        label: 'Desplazamiento - ' + action
      };
    } else {
      event = {
        event: 'ga_event',
        category: 'Comunidad',
        action: 'BPW - Inicio - Video',
        label: element.video.changingThisBreaksApplicationSecurity + ' - Desplazamiento - ' + action
      };
    }
    window.dataLayer.push(event);
  }
}

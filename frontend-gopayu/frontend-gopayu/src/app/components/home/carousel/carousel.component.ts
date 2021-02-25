import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.styl']
})
export class CarouselComponent implements OnInit {
  @Output() currentImageIndex: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  images:any = [
    'https://apicrm.betplay.com.co/5d28b46c4e980262a6703567.jpg',
    'https://apicrm.betplay.com.co/5d55e02bdb41bc2aa0139aa9.jpg',
    'https://apicrm.betplay.com.co/5d55e08bdb41bc2aa0139aaa.jpg'
  ];
  @Input()
  public type:string = 'normal';
  currentIndex = 0;
  interval; 
  carouselId = 'banner'+Math.random().toString().split('.')[1];

  constructor() { }

  ngOnInit() {
    if(this.type === 'home')
    { 
      for(let i = 0; i < this.images.length; i++) {
        let exploded = this.images[i].url.split('/');
        this.images[i].path1382 =  `${exploded[0]}//${exploded[2]}/1382_${exploded[3]}`;
        this.images[i].path992  =  `${exploded[0]}//${exploded[2]}/992_${exploded[3]}`;
        this.images[i].path768  =  `${exploded[0]}//${exploded[2]}/768_${exploded[3]}`;
        this.images[i].path480  =  `${exploded[0]}//${exploded[2]}/480_${exploded[3]}`;
        this.images[i].srcset   =  `${ this.images[i].path480 } 600w, ${ this.images[i].path768 } 800w, ${ this.images[i].path992 } 1000w, ${ this.images[i].path1382 } 1400w, ${ this.images[i].url }`;
      }
    }
    this.startInterval();
  }

  startInterval(){
    this.interval = setInterval(() => {
      this.next();
    }, Math.floor(Math.random() * 7000) + 4000);
  }

  resetInterval()
  {
    clearInterval(this.interval);
    this.startInterval();
  }

  goToIndex(_index)
  { 
    this.resetInterval();
    let items:any = document.querySelectorAll(`#${this.carouselId} .bet-carousel-item`);

    if(items.length > 0)
    {   
      var translation = -100 * (_index);

      for(let i = 0; i < items.length; i++)
      { 
        var item = items[i];

        item.style.transform = `translate(${ translation }%)`;
        
      }

      this.currentIndex = _index;
    }
  }

  next()
  {
    this.resetInterval();
    let items:any = document.querySelectorAll(`#${this.carouselId} .bet-carousel-item`);

    if(items.length > 0)
    {   
      var translation = (this.currentIndex >= (this.images.length - 1)) ? 0 : -100 * (this.currentIndex+1);
      
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
    this.currentImageIndex.emit(this.currentIndex);
  }

  back()
  {
    this.resetInterval();
    let items:any = document.querySelectorAll(`#${this.carouselId} .bet-carousel-item`);

    if(items.length > 0)
    {   
      var translation = (this.currentIndex == 0) ? -100 * (this.images.length-1) : -100 * (this.currentIndex-1);
      
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
        this.currentIndex = this.images.length-1;
      }
    }
  }

  internalPromotion(): void {
    const image = this.images[this.currentIndex];
    const event = {
      event: 'promotionClick',
      ecommerce: {
          promoClick: {
              promotions: [
              {
                  id: image.id,
                  name: image.url,
                  creative: image.url.split('/')[3],
                  position: this.currentIndex + 1
              }]
          }
      }
  };
    window.dataLayer.push(event);
  }
}

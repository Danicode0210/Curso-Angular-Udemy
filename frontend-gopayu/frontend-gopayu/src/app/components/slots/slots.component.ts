import { SlotsService } from './../../services/slots.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.styl']
})
export class SlotsComponent implements OnInit {

  public isLoading:Boolean = false;
  public categories:any = [];
  public banner:Array<Object> = [];
  public imgPath:String = "";
  private index = [];
  public data:Array<Object>;
  public id:string = '';
  public activateTimer:boolean = true;
  public session: Boolean = false;
  public isBrowser;
  private paginations = [];
  private perPage:number = 8;
  private scrolling:boolean = false;
  private loadingSlots:boolean = false;
  public currentCategory:string = '';
  public slots:any = []; 
  public navCategoryId:string = '';
  public favoriteSlots:any;
  public favoriteSlotsFake:any;
  public showFavorites:boolean = false;
  public banners;

  constructor(
      private service:SlotsService,
      private title: Title,
      private meta: Meta,
      @Inject(PLATFORM_ID) platformId: Object,
      private snackBar:MatSnackBar
  ) 
  {   
    this.isBrowser = isPlatformBrowser(platformId);

    this.title.setTitle("Juegos de Slots Online ® Betplay 【 2020 】");
      this.meta.updateTag({
        name: 'description',
        content: 'Diversa oferta de juegos de Casino Online: Tragamonedas (Slots), Video Bingo, Ruleta, Bonos de Casino, Promociones.'
      });
    
    if(this.isBrowser){
      if(localStorage.getItem('session'))
      {
          this.session = true;
          let profile = JSON.parse(localStorage.getItem('profile'));
          this.favoriteSlots = (localStorage.getItem('favoriteSlots'+profile.accountCode)) ? JSON.parse(localStorage.getItem('favoriteSlots'+profile.accountCode)) : [];
          this.favoriteSlotsFake = (localStorage.getItem('favoriteSlotsFake'+profile.accountCode)) ? JSON.parse(localStorage.getItem('favoriteSlotsFake'+profile.accountCode)) : [];
      }
      this.validateSlots();
    }
    else 
    {
      this.getSlotsCategories();
    }
  }

  ngOnInit() {
    this.gaEventBanners();
  }

  addFavoriteSlot(slot)
  { 
    let profile = JSON.parse(localStorage.getItem('profile'));
    var favoriteSlots:any = (localStorage.getItem('favoriteSlots'+profile.accountCode)) ? JSON.parse(localStorage.getItem('favoriteSlots'+profile.accountCode)) : false;
    var favoriteSlotsFake:any = (localStorage.getItem('favoriteSlotsFake'+profile.accountCode)) ? JSON.parse(localStorage.getItem('favoriteSlotsFake'+profile.accountCode)) : false;
    
    if(!favoriteSlotsFake)
    {
      favoriteSlotsFake = new Object();
      favoriteSlotsFake[slot._id] = slot._id;
    }
    else 
    { 
      
      if(favoriteSlotsFake[slot._id])
      {
        delete(favoriteSlotsFake[slot._id]);
      }
      else 
      {
        favoriteSlotsFake[slot._id] = slot._id;
      }
    }

    if(!favoriteSlots)
    {
      favoriteSlots = new Array();
      favoriteSlots.push(slot);
    }
    else 
    { 
      let search = favoriteSlots.find(item => item._id == slot._id);

      if(search)
      {
        favoriteSlots = favoriteSlots.filter(item => item._id != slot._id);
      }
      else 
      {
        favoriteSlots.push(slot);
      }
    }

    this.favoriteSlots = favoriteSlots;
    this.favoriteSlotsFake = favoriteSlotsFake;
    localStorage.setItem('favoriteSlots'+profile.accountCode, JSON.stringify(favoriteSlots));
    localStorage.setItem('favoriteSlotsFake'+profile.accountCode, JSON.stringify(favoriteSlotsFake));
  }

  validateSlots()
  {
    if(localStorage.getItem('categoriesSlot') && localStorage.getItem('categoriesSlotMaxAge'))
    {
      this.categories = JSON.parse(localStorage.getItem('categoriesSlot'));

      if(new Date().getTime() > parseInt(localStorage.getItem('categoriesSlotMaxAge')))
      {
        this.getSlotsCategories();
      }
      else
      { 
        let response = JSON.parse(localStorage.getItem('categoriesSlot'));
        this.setData( response.data, response.imagePath, response.banner );
      }
      this.setIndexes();
    }
    else
    {
      this.getSlotsCategories();
    }
  }

  setIndexes()
  {
    for(let i = 0; i < this.categories.length; i++)
    {
      this.index['cat'+this.categories[i]._id] = 0;
      this.paginations['cat'+this.categories[i]._id] = 8;
    }

  }

  goToSlot(_id, slotId)
  {
    var elements:any = document.querySelectorAll(`#${_id} .bc-carousel-item`);

    if(this.index[_id]+2 < (elements.length - 1))
    {
      this.index[_id] = this.index[_id]+2;
    }
    else
    {
      this.index[_id] = 0;
    }

    for(let i = 0; i < elements.length; i++)
    {
       let id = elements[i].getAttribute("id");

       if(id === slotId)
       {
          this.index[_id] = i;
       }  
    }

    for(let i = 0; i < elements.length; i++)
    {
      elements[i].style.transform = 'translateX(-'+106*this.index[_id]+'%)';
    }
  }

  async next(_id, categoryTitle){
    this.gaEventSlotsCarrousel(true, categoryTitle);
    await this.getPaginatedSlots(_id);

    var elements:any = document.querySelectorAll('#'+ _id + ' .bc-carousel-item');
    if(this.index[_id]+1 < (elements.length - 1))
    {
      this.index[_id] = this.index[_id]+2;
    }
    else
    {
      this.index[_id] = 0;
    }

    setTimeout(() => {
      elements = document.querySelectorAll('#'+ _id + ' .bc-carousel-item');
      for(let i = 0; i < elements.length; i++)
      {
        elements[i].style.transform = 'translateX(-'+100*this.index[_id]+'%)';
      }
    }, 200);

  }

  async carouselScrolled(_id)
  { 
    if(!this.scrolling)
    {
      this.scrolling = true;
      let item = document.getElementById(_id);
      if(item.scrollLeft > (item.scrollWidth/2))
      {
        await this.getPaginatedSlots(_id.replace('-scroll-',''));
      }
      this.scrolling = false;
    }
  }

  linkChanged(id)
  { 
    this.showFavorites = false;
    if(id === 'FAVORITE')
    {   
      if(!this.session)
      {
        this.snackBar.open("Debes iniciar sesión", "Cerrar",{
          duration:3000
        });
      }
      else if(!this.favoriteSlots || this.favoriteSlots.length === 0)
      {
        this.snackBar.open("No tienes slots guardados en favoritos", "Cerrar",{
          duration:3000
        });
      }
      else 
      {
        this.showFavorites = true;
      }

    }
    else
    { 
      this.navCategoryId = id;
      this.getSlotsByCategoryId(id);
    }
  }

  async back(_id, categoryTitle){
    this.gaEventSlotsCarrousel(false, categoryTitle);
    var elements:any = document.querySelectorAll('#'+ _id + ' .bc-carousel-item');

    if(this.index[_id] != 0)
    {
      this.index[_id] = this.index[_id]-2;
    }
    else
    {
      await this.getPaginatedSlots(_id);
      this.index[_id] = elements.length-1;
    }

    setTimeout(() => {
      elements = document.querySelectorAll('#'+ _id + ' .bc-carousel-item');
      
      for(let i = 0; i < elements.length; i++)
      {
        elements[i].style.transform = 'translateX(-'+100*this.index[_id]+'%)';
      }
    }, 200);
  }

  getSlotsCategories()
  {
    this.isLoading = true;

    this.service.getCategories()
    .subscribe((response:any) => {
      this.isLoading = false;
      response.data = response.data.sort(this.compare);
      this.setData( response.data, response.imagePath, response.banner );
      if(this.isBrowser)
      { 
        localStorage.setItem('categoriesSlot', JSON.stringify(response));
        localStorage.setItem('categoriesSlotMaxAge', (new Date().getTime()+2000000).toString());
      }
    },
    err => {
      this.isLoading = false;
    });
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.sort;
    const bandB = b.sort;
  
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  getSlotsByCategoryId(_id)
  {
    if(this.currentCategory != _id)
    {
      this.service.getSlotsByCategoryId(_id)
      .subscribe((response) => {
        this.slots = response['data'];
        this.currentCategory = _id;
      });
    }
    else 
    {
      this.currentCategory = '-';
    }
  }

  getPaginatedSlots(_id)
  { 
    if(!this.paginations[_id] || this.loadingSlots)
    {
      return false;
    }
    this.loadingSlots = true;
    return new Promise((resolve, reject) => {
      this.service.getPaginatedSlots(_id.replace('cat',''), this.paginations[_id], this.perPage)
      .subscribe(response => {
        this.loadingSlots = false;
        if(response['data'].length === 0)
        {
          this.paginations[_id] = false;
        }
        else 
        {
          this.paginations[_id] = this.paginations[_id]+8;
          for(let i = 0; i < this.categories.length; i++)
          { 
            if(this.categories[i]._id === _id.replace('cat',''))
            { 
              for(let j = 0; j < response['data'].length; j++)
              {
                this.categories[i].slots.push(response['data'][j]);
              }
            }
          }
        }
        resolve();
      },
      () => {
        this.loadingSlots = false;
        resolve();
      })
    });
    
  }

  setData(data, imagePath, banner)
  {
    this.categories = data;
    this.imgPath = imagePath;
    var images = new Array();

    for(let i = 0; i < banner.length; i++){
      images.push(banner[i].path);
    }

    this.banner = images;

    this.setIndexes();
  }

  no_js_login(event, categoryLabel: string, slotGame: string)
  {
    this.gaEventSlots(categoryLabel, slotGame);
    if(!this.session)
    { 
      event.preventDefault();
      
      this.snackBar.open("Debes iniciar sesión para jugar", "Cerrar",{
        duration:3000
      });

      return false;
    }
  }

  gaEventSlots(categoryLabel: string, slotGame: string): void {
    const event = {
      event: 'ga_event',
      category: 'Casino',
      action: 'BPW - ' + categoryLabel,
      label: 'Ir a - ' + slotGame
    };
    window.dataLayer.push(event);
  }

  gaEventSlotsCarrousel(isNext: boolean, category: string): void {
    const event = {
      event: 'ga_event',
      category: 'Casino',
      action: 'BPW - ' + category,
      label: 'Desplazamiento - ' + (isNext === true ? 'Next' : 'Last')
    };
    window.dataLayer.push(event);
  }

  gaEventBanners(): void {
    const slots = new Array();
    const bannerStorage = localStorage.getItem('categoriesSlot');
    if (bannerStorage) {
      this.banners = JSON.parse(bannerStorage).data;
      this.banners.forEach((element) => {
        element.slots.forEach(banner => {
          slots.push({
            id: banner._id,
            name: banner.buttonText,
            creative: banner.feature.split('/')[4],
            position: (element.slots.findIndex(data => data === banner)) + 1
          });
        });
      });
      const event = {
        event: 'promotionView',
        ecommerce: {
          promoView: {
            promotions: slots
          }
        }
      };
      window.dataLayer.push(event);
    }
  }
  internalPromotion(slot): void {
    let pos = 0;
    this.banners.forEach(element => {
      element.slots.forEach (banner => {
        if (banner._id === slot._id) {
          pos = element.slots.findIndex(data => data === banner) + 1;
        }
      });
    });
    const event = {
      event: 'promotionClick',
        ecommerce: {
            promoClick: {
                promotions: [
                {
                    id: slot._id,
                    name: slot.title,
                    creative: slot.feature.split('/')[3],
                    position: pos
                }]
            }
        }

    };
    window.dataLayer.push(event);
  }
}

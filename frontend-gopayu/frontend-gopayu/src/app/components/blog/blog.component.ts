import { Component, OnInit, Inject } from '@angular/core';
import { BlogsService } from "../../services/blog.service"
import {MatSnackBar} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: []
})
export class BlogComponent implements OnInit {

  public isLoading:boolean=true;
  public posts:any;
  public background:any;
  public bkRoute:any;
  public lastPost:any;
  public featured:any;
  public mostPopular:any;
  public videos:any;
  public whatchId:string = '';
  public isBrowser:boolean;
  public socialNetworks:Array<Object> = [
      {image: require('../../../assets/img/blog/fb.png'), link:'https://es-la.facebook.com/BetPlayCO/', target:'_blank'},
      {image: require('../../../assets/img/blog/tt.png'), link:'https://twitter.com/betplayco?lang=en', target:'_blank'},
      {image: require('../../../assets/img/blog/instagram.png'), link:'https://www.instagram.com/betplayco/', target:'_blank'},
  ]

  constructor(private service:BlogsService,
              public sanitizer: DomSanitizer,
              private title: Title,
              private meta: Meta,
              @Inject(PLATFORM_ID) platformId: Object,
              private snackBar:MatSnackBar) {
      this.getPost();
      this.getActivatedVideos();
      this.getFeatured();
      this.getBackground();
      this.getLastPost();
      this.getMostPopular();
      this.isBrowser = isPlatformBrowser(platformId);
      this.title.setTitle("Blog - ® BetPlay 【 2020 】");
      this.meta.updateTag({
        name: 'description',
        content: 'Apuéstale a tu pasión en BetPlay.com.co ✅ la plataforma de Apuestas Deportivas Online más grande en Colombia: Apuestas Deportivas en Vivo, Sencillas, Combinadas, Casino Online, Bonos de Apuestas, Cash Out en vivo, Promociones, Sportsbook.'
      });
    }

  ngOnInit () {
      if(this.isBrowser)
      {
          this.initTwitter();
      }
  }

  initTwitter()
  {
    !function(d,s,id):any{
      var js: any,
          fjs=d.getElementsByTagName(s)[0],
          p='https';
        if(!d.getElementById(id)){
            js=d.createElement(s);
            js.id=id;
            js.src=p+"://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js,fjs);
        }
    }
    (document,"script","twitter-wjs");

    setTimeout(() => {
      let win:any = window;
      if(win)
      {
        win.twttr.widgets.load();
      }
    },1000);
  }

  getBackground()
  {
      this.service.getBackground()
      .subscribe((response:any) => {
          if(!response.length)
          {
            this.background = response;
            if(!this.bkRoute)
            {
                this.bkRoute = this.sanitizer.bypassSecurityTrustStyle(`url('${response.path}')`);
            }
          }
      });
  }
  getLastPost()
  {
      this.service.getLastPost()
      .subscribe((response:any) => {
          if(response.length > 0)
          {
            this.lastPost = response[0];
          }
      });
  }

  getMostPopular()
  {
      this.service.getMostPopular()
      .subscribe((response:any) => {
          if(response.length > 0)
          {
            this.mostPopular = response[0];
          }
      });
  }

  getFeatured()
  {
      this.service.getFeatured()
      .subscribe((response:any) => {

          var features = new Array();

          for(let i = 0; i < response.length ;i++)
          {
              features.push({id: response[i]._id ,image:encodeURI(response[i].image), text:response[i].title, link:'/blog/'+this.generateSlug(response[i].title)+'/'+response[i]._id, target:'_self'});
          }
          this.featured = features;
        });
  }

  getActivatedVideos()
  {
    this.service.getActivatedVideos()
    .subscribe((response:any) => {
      var vid = response.data;
      this.videos = new Array();
      for(let i = 0; i < vid.length; i++)
      { 
          if(vid[i].tipo == 'youtube')
          { 
            vid[i].path = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+vid[i].path);
          }
          this.videos.push({_id:vid[i]._id, video:vid[i].path, tipo:vid[i].tipo, url:vid[i].url, preview:vid[i].previewImage});
      }

    });
  }

  getPost()
  {
    this.service.getPosts()
    .subscribe((response:any) => {
        this.posts = response.data;
        this.isLoading = false;
    },
    err => {
        this.isLoading = false;
    });
  }
  

  public generateSlug(_text): void {
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, len = from.length; i < len; i++)
    {
      _text = _text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    };
    return _text
        .toString()                     // Cast to string
        .toLowerCase()                  // Convert the string to lowercase letters
        .trim()                         // Remove whitespace from both sides of a string
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/&/g, '-y-')           // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  }

  gaEventCommunityBanner(banner: string): void {
    const event = {
      event: 'ga_event',
      category: 'Comunidad',
      action : 'BPW - Inicio - Banner',
      label: banner
    };
    window.dataLayer.push(event);
  }

  gaEventCommunitySocialMedia(socialMedia: string): void {
    const event = {
      event: 'ga_event',
      category: 'Comunidad',
      action: 'BPW - Inicio - Redes Sociales',
      label: socialMedia
    };
    window.dataLayer.push(event);
  }
}

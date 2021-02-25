import { Component, OnInit } from '@angular/core';
import { BlogsService } from "../../../services/blog.service"
import { DomSanitizer } from '@angular/platform-browser';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router"
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: []
})
export class NewsComponent implements OnInit {
  public bkRoute:any;
  public background:any;
  public post:any;
  public isLoading:boolean = true;
  public html:any;
  public months:any = [];
  public routes:Array<any> = new Array();
  public pageTitles = {
    NOTICIAS: 'Noticias',
    'APUESTAS DEPORTIVAS': 'Apuestas Deportivas',
    CASINO: 'Casino',
    'TU SECCIÓN': 'Tu Seccion'
  };

  constructor(private service:BlogsService,
              private title: Title,
              private meta: Meta,
              private activatedRoute:ActivatedRoute,
              public sanitizer: DomSanitizer,
              private router:Router
    ) {

      this.routes['noticias'] = 'NOTICIAS';
      this.routes['apuestas-deportivas'] = 'APUESTAS DEPORTIVAS';
      this.routes['casino'] = 'CASINO';
      this.routes['tu-seccion'] = 'TU SECCIÓN';

      this.title.setTitle(this.routes[this.activatedRoute.params['_value']['category']]);

      this.months['January'] = 'Mayo';
        this.months['February'] = 'Mayo';
        this.months['March'] = 'Mayo';
        this.months['April'] = 'Mayo';
        this.months['May'] = 'Mayo';
        this.months['June'] = 'Junio';
        this.months['July'] = 'Julio';
        this.months['August'] = 'Agosto';
        this.months['September'] = 'Septiembre';
        this.months['October'] = 'Octubre';
        this.months['November'] = 'Noviembre';
        this.months['December'] = 'Diciembre';

        this.router.events.subscribe((val) => {
            // see also
            if(val instanceof NavigationEnd)
            {
                this.getDetailCategoryDetail();
            }
        });

        this.getBackground();
        this.getDetailCategoryDetail();

    }

  ngOnInit() {

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
  getDetailCategoryDetail(){
      this.isLoading = true;
      this.service.getCategoryDetail(this.routes[this.activatedRoute.params['_value']['category']])
      .subscribe((response:any) => {
          this.isLoading = false;
          if(response)
          {
            this.post = response;
            this.html = this.sanitizer.bypassSecurityTrustHtml(response.html);
          }
      },
      () => {
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

  gaEventCommunutyNews(bannerTitle: string, isPrincipal: boolean, isSuperior): void {
    const page = this.routes[this.activatedRoute.params['_value']['category']];
    const pageTitle = this.pageTitles[page];
    let event;
    if (!isPrincipal && isSuperior) {
      event = {
        event: 'ga_event',
        category: 'Comunidad',
        action: 'BPW - ' + pageTitle + ' - Banner superior lateral',
        label: 'Ver - ' + bannerTitle
      };
    } else if (!isPrincipal && !isSuperior) {
      event = {
        event: 'ga_event',
        category: 'Comunidad',
        action: 'BPW - ' + pageTitle + ' - Banner inferior lateral',
        label: 'Ver - ' + bannerTitle
      };
    } else {
      event = {
        event: 'ga_event',
        category: 'Comunidad',
        action: 'BPW - ' + pageTitle + ' - Banner principal',
        label: 'Ver - ' + bannerTitle
      };

    }
    window.dataLayer.push(event);
  }
}

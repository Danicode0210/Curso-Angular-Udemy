import { ShareComponent } from './../share/share.component';
import { Component, OnInit, Inject } from '@angular/core';
import { BlogsService } from "../../../services/blog.service"
import { DomSanitizer } from '@angular/platform-browser';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: []
})
export class BlogdetailComponent implements OnInit {
  public isLoading:boolean = true;
  public post:any;
  public html:any;
  public bkRoute:any;
  public background:any;
  public months:any = [];
  public isLiked:any;
  public comment:string = '';
  public profile:any;
  public isBrowser;

  constructor(private service:BlogsService,
              public sanitizer: DomSanitizer,
              private title: Title,
              private meta: Meta,
              private snackBar:MatSnackBar,
              public dialog: MatDialog,
              private router:Router,
              private route:ActivatedRoute,
              @Inject(PLATFORM_ID) platformId: Object,
             )
    {
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
        this.isBrowser = isPlatformBrowser(platformId);

        this.getDetail();

        if(this.isBrowser)
        {
          if(localStorage.getItem('profile'))
          {
            this.profile = JSON.parse(localStorage.getItem('profile'));
          }
        }
    }

  ngOnInit() {
      this.getBackground();
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
  getDetail(){
      this.isLoading = true;
      this.service.getBlogsDetail(this.route.params['value']['id'])
      .subscribe((response:any) => {
          this.post = response;
          this.title.setTitle(response.pageTitle);
          this.meta.updateTag({
            name: 'description',
            content: response.shortDescription
          });
          this.html = this.sanitizer.bypassSecurityTrustHtml(response.html);
          if(localStorage.getItem('profile'))
          {
            var profile = JSON.parse(localStorage.getItem('profile'));

            this.isLoading = true;
            this.isLiked = null;
            for(let i = 0; i < response.likes.length; i++)
            {
              var userId = this.post.likes[i]['userId'];
              if(userId == profile.identityDocument.number)
              {
                  this.isLiked = this.post.likes[i]['_id'];
              }
            }
          }
          this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      });
  }
  getDetailById(_id){
    this.service.getBlogsDetail(_id)
    .subscribe((response:any) => {
        this.post = response;
        this.html = this.sanitizer.bypassSecurityTrustHtml(response.html);
        if(localStorage.getItem('profile'))
          {
            var profile = JSON.parse(localStorage.getItem('profile'));

            this.isLoading = true;
            this.isLiked = null;
            for(let i = 0; i < response.likes.length; i++)
            {
              var userId = this.post.likes[i]['userId'];
              if(userId == profile.identityDocument.number)
              {
                  this.isLiked = this.post.likes[i]['_id'];
              }
            }
          }
        this.isLoading = false;
    },
    () => {
      this.isLoading = false;
    });
  }

  openShareDialog(post){
    const dialogRef = this.dialog.open(ShareComponent, {
      data:post
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  setLike()
  {
    if(localStorage.getItem('profile'))
    {
      var profile = JSON.parse(localStorage.getItem('profile'));

      this.isLoading = true;

      this.service.setLike({
        postId: this.route.params['value']['id'],
        userId: profile.identityDocument.number
      })
      .subscribe((response:any) => {
        this.getDetail();
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      });
    }
    else
    {
      this.snackBar.open("Debes iniciar sesión", "Cerrar",{
        duration:3000
      });
    }
  }

  setComment()
  {
    this.isLoading = true;

    this.service.setComment(this.route.params['value']['id'], {
      comment:this.comment,
      name: `${this.profile.firstName} ${this.profile.lastName}`,
      userId: this.profile.identityDocument.number
    })
    .subscribe((response:any) => {
      this.comment = '';
      this.getDetail();
      this.isLoading = false;
    },
    err => {
      this.isLoading = false;
    });
  }

  setDislike(_id)
  {
    this.isLoading = true;

    this.service.setDisLike(_id)
    .subscribe((response:any) => {
      this.getDetail();
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

}

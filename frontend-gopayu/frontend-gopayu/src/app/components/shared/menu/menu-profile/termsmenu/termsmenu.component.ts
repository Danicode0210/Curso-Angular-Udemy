import { AppState } from './../../../../../app.state';
import { MenuService } from 'src/app/services/menu.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-termsmenu',
  templateUrl: './termsmenu.component.html',
  styleUrls: []
})
export class TermsmenuComponent implements OnInit {

  public terms:any = new Array();
  public isLoading:boolean = true;
  public currentTerms:string = 'https://apicrm.betplay.com.co/terms/';
  public assetsSubscription: Subscription;
  public texts$;
  public localTexts$;

  constructor(private service:MenuService, private store:Store<AppState>) { }

  ngOnInit() {
      this.getTerms();
      // this.getCurrentTerms();
  }

  getCurrentTerms()
  {   
      this.assetsSubscription = this.store.select('assets').subscribe( assets => {
        this.texts$ = assets.texts;
        this.localTexts$ = assets.i18n;
      });

      // this.assetsService.getTerms()
      // .subscribe((response:any) => {
      //     this.currentTerms = response.data[0].path;
      // });
  }

  getTerms()
  {
    this.isLoading = true;

    this.service.getTerms()
    .subscribe((response:any) => {
        this.isLoading = false;
        this.terms = response;
    },
    () => {
        this.isLoading = false;
    });
  }

  gaEventGetTerms(document: string): void {
    const event = {
      event: 'ga_event',
      category: 'Mi Cuenta',
      action: 'BPW - Terminos y condiciones',
      label: 'Descargar - ' + document
    };
    window.dataLayer.push(event);
  }
}

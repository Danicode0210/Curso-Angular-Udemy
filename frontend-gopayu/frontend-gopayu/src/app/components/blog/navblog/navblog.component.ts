import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navblog',
  templateUrl: './navblog.component.html',
  styles: []
})
export class NavblogComponent implements OnInit {

  public activeRoute = '';
  public routes = {
    '/blog/apuestas-deportivas': 'Apuestas Deportivas',
    '/blog/casino': 'Casino',
    '/blog/tu-seccion': 'Tu Seccion',
    '/blog/noticias': 'Noticias',
    '/blog': 'Inicio'
  };
  constructor(private router: Router) { }

  ngOnInit() {
  }

  gaEventCommunity(buttonLabel: string): void {
    const event = {
      event: 'ga_event',
      category: 'Comunidad',
      action: 'BPW - ' + this.routes[this.router.url] + ' - Menu',
      label: buttonLabel
    };
    window.dataLayer.push(event);
  }
}

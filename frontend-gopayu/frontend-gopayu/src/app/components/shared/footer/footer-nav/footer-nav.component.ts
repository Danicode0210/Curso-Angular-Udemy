import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styles: []
})
export class FooterNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  gaEventFooterNav(category: string, link: string): void {
    const event = {
      event: 'ga_event',
      category: 'Footer',
      action: 'BPW - Informativo',
      label: category + ' - ' + link
    };
    window.dataLayer.push(event);
  }
}

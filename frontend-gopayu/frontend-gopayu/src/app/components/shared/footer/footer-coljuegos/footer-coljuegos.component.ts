import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-coljuegos',
  templateUrl: './footer-coljuegos.component.html',
  styles: []
})
export class FooterColjuegosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  gaEventFooterColjuegos(text: string): void {
    const event = {
      event: 'ga_event',
      category: 'Footer',
      action: 'BPW - Coljuegos',
      label: text
    };
    window.dataLayer.push(event);
  }
}

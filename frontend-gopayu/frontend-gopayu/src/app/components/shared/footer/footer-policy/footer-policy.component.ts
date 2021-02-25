import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-policy',
  templateUrl: './footer-policy.component.html',
  styles: []
})
export class FooterPolicyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  gaEventFooterPolicy(policy: string): void {
    const event = {
      event: 'ga_event',
      category: 'Footer',
      action: 'BPW - Politicas',
      label: policy
    };
    window.dataLayer.push(event);
  }
}

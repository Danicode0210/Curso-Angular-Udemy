import { Component, OnInit } from "@angular/core";

import { HomeService } from "../../../../services/home.service";

@Component({
  selector: "app-payment-methods",
  templateUrl: "./payment-methods.component.html",
  styles: [],
})
export class PaymentMethodsComponent implements OnInit {
  public homeImages: any = [];
  public linkBaloto = 'https://www.baloto.com/';
  public linkMastercard = 'https://www.mastercard.com.co/';
  public linkPSE = 'https://www.pse.com.co/inicio';
  public linkSuRed = 'https://www.sured.com.co/';
  public linkSuperGiros = 'https://www.supergiros.com.co/';
  public linkPayU = 'https://www.payulatam.com/co/';
  constructor(private service: HomeService) {}

  ngOnInit() {
    this.getHomeImages();
  }

  gaEventPaymentMethods(link: string): void {
    let text = '';
    if (link === this.linkSuRed) {
      text = 'Su Red';
    } else if (link === this.linkSuperGiros) {
      text = 'Super Giros';
    } else if (link === this.linkPayU) {
      text = 'Pay U';
    } else if (link === this.linkPSE) {
      text = 'PSE';
    } else if (link === this.linkMastercard) {
      text = 'Mastercard';
    } else if (link === this.linkBaloto) {
      text = 'Baloto';
    } else {
      text = 'Visa';
    }
    const event = {
      event: 'ga_event',
      category: 'Footer',
      action: 'BPW - Métodos de pago',
      label: text
    };
    window.dataLayer.push(event);
  }

  getHomeImages() {
    this.service.getHomeImages().subscribe((response: any) => {
      this.homeImages = [];

      for (let i = 0; i < response.length; i++) {
        if (response[i].type == "PAYMENT_METHOD") {
          this.homeImages.push(response[i]);
        }
      }
    });
  }
}

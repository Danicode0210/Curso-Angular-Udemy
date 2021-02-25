import { ActivatedRoute } from "@angular/router";
import { Router, NavigationEnd, Route } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { IfStmt } from "@angular/compiler";

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styles: [],
})
export class HelpComponent implements OnInit {
  public faq_title: string = "Apuestas";
  public titles: Array<any> = new Array();

  constructor(private router: Router) {
    this.titles["/faq/apuestas"] = "APUESTAS";
    this.titles["/faq/slots"] = "SLOTS";
    this.titles["/faq/registro"] = "REGISTRO";
    this.titles["/faq/deposito"] = "DEPÓSITO";
    this.titles["/faq/generales"] = "GENERALES";
    this.titles["/faq/bonos"] = "BONOS";
    this.titles["/faq/retiradas"] = "RETIRADAS";
    this.titles["/faq/glosario"] = "GLOSARIO";
    this.faq_title = this.titles["/faq/" + window.location.href.split("/")[4]];
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.faq_title = this.titles[val["urlAfterRedirects"]];
      }
    });

    if (!this.faq_title) {
      this.faq_title = "APUESTAS";
    }
  }

  buscar(input) {
    var items = document.querySelectorAll(".faq_item");
    for (var i = 0; i < items.length; i++) {
      if (!items[i].innerHTML.includes(input.target.value)) {
        items[i]["style"].display = "none";
      } else {
        items[i]["style"].display = "block";
      }
    }
  }
}

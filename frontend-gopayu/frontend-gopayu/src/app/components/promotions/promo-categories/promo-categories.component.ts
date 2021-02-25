import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-promo-categories',
  templateUrl: './promo-categories.component.html',
  styleUrls: []
})
export class PromoCategoriesComponent implements OnInit {

  @Input() public categories: Array<Object>;

  constructor() { 
  }

  ngOnInit() {
  }

}

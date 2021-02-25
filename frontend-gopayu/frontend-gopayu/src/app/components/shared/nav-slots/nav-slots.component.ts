import { environment } from './../../../../environments/environment';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-slots',
  templateUrl: './nav-slots.component.html',
  styles: []
})
export class NavSlotsComponent implements OnInit {

  @Output()
  private linkChanged:EventEmitter<any> = new EventEmitter();
  public ids: Array<any> = [];

  constructor() { 
    // TOP GAMES CATEGORY ID
    this.ids[0] = (!environment.production) ? '5d2f18ba2b90861c8cb6ce1e' : '5d30db1e0d7ce6634a191b02';

    // NEW GAMES CATEGORY ID
    this.ids[1] = (!environment.production) ? '5dcb21d874850e0ad99f1391' : '5d30830e0d7ce6634a191b00';

    // CASINO CATEGORY ID
    this.ids[2] = (!environment.production) ? '5d3a1474f4c1446363c654a0' : '5d30e9640d7ce6634a191b03';

    // SLOTS CATEGORY ID
    this.ids[3] = (!environment.production) ? '5d8b606f42f5dd2d3155ca52' : '5d30e96c0d7ce6634a191b04';
    
    // FAVORITE GAMES
    this.ids[4] = 'FAVORITE';
  }

  ngOnInit() {
  }

  emitLink(id)
  { 
    this.linkChanged.emit(this.ids[id]);
  } 
}

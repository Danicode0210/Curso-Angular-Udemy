import { SlotsService } from './../../../services/slots.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slot-roules',
  templateUrl: './slot-roules.component.html',
  styleUrls: []
})
export class SlotRoulesComponent implements OnInit {

  public isLoading:boolean = false;
  public slots:any;

  constructor(
    private service:SlotsService,
  ) { }

  ngOnInit() {
    this.getSlots();
  }

  getSlots()
  {
      this.service.getSlots()
      .subscribe((response:any) => {
          this.slots = response.data;
          this.isLoading = false;
      },
      (err) => {
          this.isLoading = false;
      });
  }

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayUApiComponent } from './pay-u-api.component';

describe('PayUApiComponent', () => {
  let component: PayUApiComponent;
  let fixture: ComponentFixture<PayUApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayUApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayUApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

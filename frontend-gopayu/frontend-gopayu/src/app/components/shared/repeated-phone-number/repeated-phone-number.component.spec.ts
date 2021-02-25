import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatedPhoneNumberComponent } from './repeated-phone-number.component';

describe('RepeatedPhoneNumberComponent', () => {
  let component: RepeatedPhoneNumberComponent;
  let fixture: ComponentFixture<RepeatedPhoneNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatedPhoneNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatedPhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedLimitsComponent } from './rejected-limits.component';

describe('RejectedLimitsComponent', () => {
  let component: RejectedLimitsComponent;
  let fixture: ComponentFixture<RejectedLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedLimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

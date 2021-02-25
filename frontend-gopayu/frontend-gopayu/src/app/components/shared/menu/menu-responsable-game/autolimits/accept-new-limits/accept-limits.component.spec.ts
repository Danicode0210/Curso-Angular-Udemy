import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptLimitsComponent } from './accept-limits.component';

describe('AcceptLimitsComponent', () => {
  let component: AcceptLimitsComponent;
  let fixture: ComponentFixture<AcceptLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptLimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

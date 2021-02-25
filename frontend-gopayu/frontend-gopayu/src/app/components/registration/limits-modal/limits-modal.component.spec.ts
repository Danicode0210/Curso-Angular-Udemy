import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitsModalComponent } from './limits-modal.component';

describe('LimitsModalComponent', () => {
  let component: LimitsModalComponent;
  let fixture: ComponentFixture<LimitsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

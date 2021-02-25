import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUpdateInformationComponent } from './menu-update-information.component';

describe('MenuUpdateInformationComponent', () => {
  let component: MenuUpdateInformationComponent;
  let fixture: ComponentFixture<MenuUpdateInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUpdateInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUpdateInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

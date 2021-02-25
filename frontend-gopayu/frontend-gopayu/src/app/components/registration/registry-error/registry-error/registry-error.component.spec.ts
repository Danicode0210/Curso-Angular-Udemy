import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryErrorComponent } from './registry-error.component';

describe('RegistryErrorComponent', () => {
  let component: RegistryErrorComponent;
  let fixture: ComponentFixture<RegistryErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistryErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

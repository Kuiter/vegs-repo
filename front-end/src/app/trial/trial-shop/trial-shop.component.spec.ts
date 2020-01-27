import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialShopComponent } from './trial-shop.component';

describe('TrialShopComponent', () => {
  let component: TrialShopComponent;
  let fixture: ComponentFixture<TrialShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

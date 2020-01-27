import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapOptDialogComponent } from './swap-opt-dialog.component';

describe('SwapOptDialogComponent', () => {
  let component: SwapOptDialogComponent;
  let fixture: ComponentFixture<SwapOptDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapOptDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapOptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

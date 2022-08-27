import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptAllocationComponent } from './receipt-allocation.component';

describe('ReceiptAllocationComponent', () => {
  let component: ReceiptAllocationComponent;
  let fixture: ComponentFixture<ReceiptAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

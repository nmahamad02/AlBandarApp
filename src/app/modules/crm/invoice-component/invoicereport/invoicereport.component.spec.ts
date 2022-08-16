import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicereportComponent } from './invoicereport.component';

describe('InvoicereportComponent', () => {
  let component: InvoicereportComponent;
  let fixture: ComponentFixture<InvoicereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

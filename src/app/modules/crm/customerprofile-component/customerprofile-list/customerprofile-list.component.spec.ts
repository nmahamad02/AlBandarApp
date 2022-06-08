import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerprofileListComponent } from './customerprofile-list.component';

describe('CustomerprofileComponent', () => {
  let component: CustomerprofileListComponent;
  let fixture: ComponentFixture<CustomerprofileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerprofileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerprofileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

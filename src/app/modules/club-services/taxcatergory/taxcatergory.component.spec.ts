import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxcatergoryComponent } from './taxcatergory.component';

describe('TaxcatergoryComponent', () => {
  let component: TaxcatergoryComponent;
  let fixture: ComponentFixture<TaxcatergoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxcatergoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxcatergoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

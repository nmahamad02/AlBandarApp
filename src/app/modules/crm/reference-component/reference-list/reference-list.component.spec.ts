import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceListComponent } from './reference-list.component';

describe('ReferenceComponent', () => {
  let component: ReferenceListComponent;
  let fixture: ComponentFixture<ReferenceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

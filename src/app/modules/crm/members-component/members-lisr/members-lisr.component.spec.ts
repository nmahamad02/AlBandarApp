import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersLisrComponent } from './members-lisr.component';

describe('MembersLisrComponent', () => {
  let component: MembersLisrComponent;
  let fixture: ComponentFixture<MembersLisrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersLisrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersLisrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

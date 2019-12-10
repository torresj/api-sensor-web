import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditHouseComponent } from './admin-edit-house.component';

describe('AdminEditHouseComponent', () => {
  let component: AdminEditHouseComponent;
  let fixture: ComponentFixture<AdminEditHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

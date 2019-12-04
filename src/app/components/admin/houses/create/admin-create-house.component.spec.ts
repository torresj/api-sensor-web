import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateHouseComponent } from './admin-create-house.component';

describe('AdminCreateHouseComponent', () => {
  let component: AdminCreateHouseComponent;
  let fixture: ComponentFixture<AdminCreateHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

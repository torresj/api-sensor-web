import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSensorsComponent } from './admin-sensors.component';

describe('AdminSensorsComponent', () => {
  let component: AdminSensorsComponent;
  let fixture: ComponentFixture<AdminSensorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSensorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

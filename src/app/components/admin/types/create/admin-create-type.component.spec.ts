import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateTypeComponent } from './admin-create-type.component';

describe('AdminCreateTypeComponent', () => {
  let component: AdminCreateTypeComponent;
  let fixture: ComponentFixture<AdminCreateTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

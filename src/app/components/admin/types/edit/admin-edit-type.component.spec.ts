import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditTypeComponent } from './admin-edit-type.component';

describe('AdminEditTypeComponent', () => {
  let component: AdminEditTypeComponent;
  let fixture: ComponentFixture<AdminEditTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

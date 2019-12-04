import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminHousesComponent } from "./admin-houses.component";

describe("AdminHousesComponent", () => {
  let component: AdminHousesComponent;
  let fixture: ComponentFixture<AdminHousesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminHousesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

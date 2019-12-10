import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HouseService } from "src/app/services/house.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { AppStore } from "src/app/models/stores/appstore";
import { MatSnackBar } from "@angular/material";
import { Role } from "src/app/models/entities/user";

@Component({
  selector: "app-admin-create-house",
  templateUrl: "./admin-create-house.component.html",
  styleUrls: ["./admin-create-house.component.css"]
})
export class AdminCreateHouseComponent implements OnInit {
  createForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private houseService: HouseService,
    private activatedRoute: ActivatedRoute,
    public store: AppStore,
    private snackBar: MatSnackBar
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage([
        { label: "Gestión", url: "/admin" },
        { label: "Casas", url: "/admin/houses" },
        { label: "Crear", url: "/admin/houses/create" }
      ]);
    }
  }

  ngOnInit() {
    this.store.setError("");
    this.store.setLoading(false);
    this.authenticationService.getUserData$().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.store.setLoading(false);
        this.router.navigate(["/login"]);
      }
    );

    this.createForm = this.formBuilder.group({
      name: ["", Validators.required],
      address: [""],
      description: [""],
      latitude: [""],
      longitude: [""]
    });
  }

  get fields() {
    return this.createForm.controls;
  }

  formControl(control: string) {
    return this.createForm.controls[control];
  }

  onSubmit() {
    if (this.createForm.invalid) {
      return;
    }

    this.store.setLoading(true);
    this.houseService
      .createHouse$({
        name: this.fields.name.value,
        description: this.fields.description.value,
        address: this.fields.address.value,
        position: {
          latitude: this.fields.latitude.value,
          longitude: this.fields.longitude.value
        }
      })
      .subscribe(
        data => {
          this.store.setLoading(false);
          this.store.setError("");
          this.openSnackBar();
        },
        error => {
          this.store.setLoading(false);
          if (this.store.httpErrorCode === 304) {
            this.openSnackBar(
              "No se pudo crear la casa '" +
                this.fields.name.value +
                "', ya existe"
            );
          } else {
            this.openSnackBar("No se pudo crear la casa");
          }
        }
      );
  }

  openSnackBar(error?: string) {
    let snackBarRef = null;
    if (error) {
      snackBarRef = this.snackBar.open(error, "Cerrar");
    } else {
      snackBarRef = this.snackBar.open("Casa creada", "Cerrar", {
        duration: 5000
      });
    }
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { SensortypeService } from "src/app/services/sensortype.service";
import { AppStore } from "src/app/models/stores/appstore";
import { MatSnackBar } from "@angular/material";
import { Role } from "src/app/models/entities/user";

@Component({
  selector: "app-admin-create-type",
  templateUrl: "./admin-create-type.component.html",
  styleUrls: ["./admin-create-type.component.css"]
})
export class AdminCreateTypeComponent implements OnInit {
  createForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private typeService: SensortypeService,
    public store: AppStore,
    private snackBar: MatSnackBar
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage([
        { label: "Gestión", url: "/admin" },
        { label: "Tipos", url: "/admin/types" },
        { label: "Crear", url: "/admin/types/create" }
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
      description: [""],
      actions: [""]
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
    this.typeService
      .createType$({
        name: this.fields.name.value,
        description: this.fields.description.value,
        actions: this.fields.actions.value
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
              "No se pudo crear el tipo '" +
                this.fields.name.value +
                "', ya existe"
            );
          } else {
            this.openSnackBar("No se pudo crear el tipo");
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

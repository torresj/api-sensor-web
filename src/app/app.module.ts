import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { LayoutComponent } from "./components/layout/layout.component";
import { LoginComponent } from "./components/login/login.component";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { AppConfig } from "./app.config";

// Material
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatTabsModule } from "@angular/material/tabs";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";

// Flex layout
import { FlexLayoutModule } from "@angular/flex-layout";
import { HomeComponent } from "./components/home/home.component";
import { IndexComponent } from "./components/index/index.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { AdminComponent } from "./components/admin/admin.component";

// Mobx
import { MobxAngularModule } from "mobx-angular";
import { AdminUsersComponent } from "./components/admin/users/admin-users.component";
import { AdminEditUserComponent } from "./components/admin/users/edit/admin-edit-user.component";
import { AdminUserComponent } from "./components/admin/users/user/admin-user.component";
import { Page404Component } from "./components/page404/page404.component";
import { AdminCreateUserComponent } from "./components/admin/users/create/admin-create-user.component";
import { DeleteDialogComponent } from "./components/dialogs/delete-dialog/delete-dialog.component";
import { AdminHousesComponent } from "./components/admin/houses/admin-houses.component";
import { AdminCreateHouseComponent } from "./components/admin/houses/create/admin-create-house.component";
import { AdminHouseComponent } from "./components/admin/houses/house/admin-house.component";
import { MapsComponent } from "./components/maps/maps.component";
import { AdminEditHouseComponent } from "./components/admin/houses/edit/admin-edit-house.component";
import { AdminTypesComponent } from "./components/admin/types/admin-types.component";
import { AdminTypeComponent } from "./components/admin/types/type/admin-type.component";
import { AdminEditTypeComponent } from "./components/admin/types/edit/admin-edit-type.component";
import { AdminCreateTypeComponent } from "./components/admin/types/create/admin-create-type.component";
import { AdminSensorsComponent } from "./components/admin/sensors/admin-sensors.component";
@NgModule({
  declarations: [
    LayoutComponent,
    LoginComponent,
    HomeComponent,
    IndexComponent,
    ProfileComponent,
    AdminComponent,
    AdminUsersComponent,
    AdminEditUserComponent,
    AdminUserComponent,
    Page404Component,
    AdminCreateUserComponent,
    DeleteDialogComponent,
    AdminHousesComponent,
    AdminCreateHouseComponent,
    AdminHouseComponent,
    MapsComponent,
    AdminEditHouseComponent,
    AdminTypesComponent,
    AdminTypeComponent,
    AdminEditTypeComponent,
    AdminCreateTypeComponent,
    AdminSensorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDividerModule,
    MobxAngularModule,
    MatTabsModule,
    MatListModule,
    MatGridListModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatExpansionModule
  ],
  exports: [MapsComponent],
  entryComponents: [DeleteDialogComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AppConfig
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule {}

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { AuthGuard } from "./helpers/auth.guard";
import { IndexComponent } from "./components/index/index.component";
import { AdminComponent } from "./components/admin/admin.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { AdminUsersComponent } from "./components/admin/users/admin-users.component";
import { AdminUserComponent } from "./components/admin/users/user/admin-user.component";
import { AdminEditUserComponent } from "./components/admin/users/edit/admin-edit-user.component";
import { Page404Component } from "./components/page404/page404.component";
import { AdminCreateUserComponent } from "./components/admin/users/create/admin-create-user.component";
import { AdminHousesComponent } from "./components/admin/houses/admin-houses.component";
import { AdminCreateHouseComponent } from "./components/admin/houses/create/admin-create-house.component";
import { AdminHouseComponent } from "./components/admin/houses/house/admin-house.component";
import { MapsComponent } from "./components/maps/maps.component";
import { AdminEditHouseComponent } from "./components/admin/houses/edit/admin-edit-house.component";
import { AdminTypesComponent } from "./components/admin/types/admin-types.component";
import { AdminTypeComponent } from "./components/admin/types/type/admin-type.component";

const routes: Routes = [
  { path: "", component: IndexComponent },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: "admin/users",
    component: AdminUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/users/create",
    component: AdminCreateUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/users/:id",
    component: AdminUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/users/:id/edit",
    component: AdminEditUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/houses",
    component: AdminHousesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/houses/create",
    component: AdminCreateHouseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/houses/:id",
    component: AdminHouseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/houses/:id/edit",
    component: AdminEditHouseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/types",
    component: AdminTypesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/types/:id",
    component: AdminTypeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "maps",
    component: MapsComponent
  },
  { path: "login", component: LoginComponent },
  { path: "**", component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

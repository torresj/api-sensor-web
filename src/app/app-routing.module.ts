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

const routes: Routes = [
  { path: "", component: IndexComponent },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard] },
  {
    path: "admin/users",
    component: AdminUsersComponent,
    canActivate: [AuthGuard]
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
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
  { path: "login", component: LoginComponent },

  // otherwise redirect to home
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

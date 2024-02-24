// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { MachineFormComponent } from './commoncomponent/addmachine';
import { ManagerFormComponent } from './commoncomponent/addManager';
import { ManagerloginComponent } from './component/managerlogin/managerlogin.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'addMachine',component:MachineFormComponent},
  { path: 'addmanager',component:ManagerFormComponent},
  { path: 'mlogin',component:ManagerloginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

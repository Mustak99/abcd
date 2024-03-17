import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard'; // Import AuthGuard
import { MachineFormComponent } from './commoncomponent/addmachine';
import { ManagerFormComponent } from './commoncomponent/addManager';
import { ManagerloginComponent } from './component/managerlogin/managerlogin.component';
import { CommonlayoutComponent } from './component/commonlayout/commonlayout.component';
import { InvoiceComponent } from './component/invoice/invoice.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect empty path to login
  {
    path: '',
    component: CommonlayoutComponent,
    canActivate: [AuthGuard], // Apply AuthGuard to the parent route
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'addmachin', component: MachineFormComponent, canActivate: [AuthGuard] }, // Apply AuthGuard to child routes
      { path: 'manager', component: ManagerFormComponent, canActivate: [AuthGuard] }, // Apply AuthGuard to child routes
      { path: 'mlogin', component: ManagerloginComponent },
      { path: 'invoice', component: InvoiceComponent },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

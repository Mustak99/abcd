import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MachineFormComponent } from'./commoncomponent/addmachine';
import { Machinecard } from'./commoncomponent/machine-card';
import { InvoiceFormComponent } from'./commoncomponent/inv';
import { CommonModule } from '@angular/common';
import { ManagerFormComponent } from './commoncomponent/addManager';
import { ManagerloginComponent } from './component/managerlogin/managerlogin.component';
import { CommonlayoutComponent } from './component/commonlayout/commonlayout.component';
import { InvoiceComponent } from './component/invoice/invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    MachineFormComponent,
    Machinecard,
    ManagerFormComponent,
    ManagerloginComponent,
    CommonlayoutComponent,
    InvoiceFormComponent,
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBXu-SoPNirMAujGtHvtdqf9VNChAwQu1w",
      authDomain: "iotproject-d55c8.firebaseapp.com",
      projectId: "iotproject-d55c8",
      storageBucket: "iotproject-d55c8.appspot.com",
      messagingSenderId: "682486461763",
      appId: "1:682486461763:web:812817da394c9a8c83ebf6"
  }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ReactiveFormsModule } from '@angular/forms';

import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ProducerComponent } from './forms/producer/producer.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MatNativeDateModule } from '@angular/material/core';
import { ConsumerComponent } from './views/consumer/consumer.component';
import { MatTableModule } from '@angular/material/table';
import { SupplierComponent } from './forms/supplier/supplier.component';
import { SellerComponent } from './forms/seller/seller.component';

import { RegisterComponent } from './register/register.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginCommonComponent } from './views/login-common/login-common.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    },
  ],
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProducerComponent,
    ConsumerComponent,
    SupplierComponent,
    SellerComponent,
    RegisterComponent,
    LoginCommonComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

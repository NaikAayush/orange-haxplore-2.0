import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProducerComponent } from './forms/producer/producer.component';
import { SellerComponent } from './forms/seller/seller.component';
import { SupplierComponent } from './forms/supplier/supplier.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConsumerComponent } from './views/consumer/consumer.component';

const routes: Routes = [
  { path: 'login/:type', component: LoginComponent },
  { path: 'register/:type', component: RegisterComponent },

  { path: 'producer', component: ProducerComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'seller', component: SellerComponent },

  { path: 'data/:cropId', component: ConsumerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

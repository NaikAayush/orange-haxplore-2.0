import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProducerComponent } from './forms/producer/producer.component';
import { LoginComponent } from './login/login.component';
import { RegisterProducerComponent } from './register/register-producer/register-producer.component';

const routes: Routes = [
  { path: 'producer/login', component: LoginComponent },
  { path: 'producer/register', component: RegisterProducerComponent },
  { path: 'supplier/login', component: LoginComponent },
  { path: 'seller/login', component: LoginComponent },
  { path: 'producer', component: ProducerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
})
export class SupplierComponent implements OnInit {
  ID;
  C_ID;
  date;
  serializedDate;
  supplierForm = this.formBuilder.group({
    c_id: '',
    id: '',
    s_loc: '',
    s_name: '',
    s_date: '',
    s_w: '',
    s_t: '',
  });

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  async ngOnInit() {
    this.date = new Date();
    this.serializedDate = new Date().toISOString();
    const user = await this.auth.getUser();
    console.log(user);
    this.ID = await this.auth.getProducerId(user.uid);

    this.supplierForm.patchValue({ id: this.ID.id });
    this.supplierForm.patchValue({ s_loc: this.ID.loc });
    this.supplierForm.patchValue({ s_name: this.ID.name });
    this.supplierForm.patchValue({ s_date: this.serializedDate });
  }

  async onSubmit() {
    console.log(this.supplierForm.value);

    await this.http
      .post<any>(
        environment.apiUrl + 'update/' + this.supplierForm.value.c_id,
        {
          p_id: this.supplierForm.value.id,
          s_loc: this.supplierForm.value.s_loc,
          s_name: this.supplierForm.value.s_name,
          s_date: this.supplierForm.value.s_date,
          s_w: this.supplierForm.value.s_date,
          s_t: this.supplierForm.value.s_t,
        }
      )
      .toPromise();

    this.supplierForm.reset();
    this.router.navigateByUrl('/supplier');
  }
}

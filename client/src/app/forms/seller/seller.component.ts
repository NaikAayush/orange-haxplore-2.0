import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css'],
})
export class SellerComponent implements OnInit {
  ID;
  C_ID;
  date;
  serializedDate;
  sellerForm = this.formBuilder.group({
    c_id: '',
    id: '',
    se_loc: '',
    se_name: '',
    se_date: '',
    se_w: '',
    se_t: '',
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

    this.sellerForm.patchValue({ id: this.ID.id });
    this.sellerForm.patchValue({ se_loc: this.ID.loc });
    this.sellerForm.patchValue({ se_name: this.ID.name });
    this.sellerForm.patchValue({ se_date: this.serializedDate });
  }
  async onSubmit() {
    console.log(this.sellerForm.value);

    await this.http
      .post<any>(environment.apiUrl + 'update/' + this.sellerForm.value.c_id, {
        se_id: this.sellerForm.value.id,
        se_loc: this.sellerForm.value.se_loc,
        se_name: this.sellerForm.value.se_name,
        se_date: this.sellerForm.value.se_date,
        se_w: this.sellerForm.value.se_w,
        se_t: this.sellerForm.value.se_t,
      })
      .toPromise();

    this.sellerForm.reset();
    this.router.navigateByUrl('/seller');
  }
}

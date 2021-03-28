import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { customRandom } from 'nanoid';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
declare var require: any;
var seedrandom = require('seedrandom');

var seed = Math.random();
const rng = seedrandom(seed);
const nanoid = customRandom('1234567890', 6, (size) => {
  return new Uint8Array(size).map(() => 256 * rng());
});

@Component({
  selector: 'app-producer',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.css'],
})
export class ProducerComponent implements OnInit {
  ID;
  C_ID;
  date;
  serializedDate;
  producerForm = this.formBuilder.group({
    c_id: '',
    id: '',
    p_loc: '',
    p_name: '',
    p_date: '',
    p_w: '',
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

    this.C_ID = nanoid();
    this.producerForm.patchValue({ id: this.ID.id });
    this.producerForm.patchValue({ c_id: this.C_ID });
    this.producerForm.patchValue({ p_loc: this.ID.loc });
    this.producerForm.patchValue({ p_name: this.ID.name });
    this.producerForm.patchValue({ p_date: this.serializedDate });
  }

  async onSubmit() {
    console.log(this.producerForm.value);

    await this.http
      .post<any>(
        environment.apiUrl + 'create/' + this.producerForm.value.c_id,
        {
          p_id: this.producerForm.value.id,
          p_loc: this.producerForm.value.p_loc,
          p_name: this.producerForm.value.p_name,
          p_date: this.producerForm.value.p_date,
          p_w: this.producerForm.value.p_date,
        }
      )
      .toPromise();

    this.producerForm.reset();
    this.router.navigateByUrl('/producer');
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register-producer',
  templateUrl: './register-producer.component.html',
  styleUrls: ['./register-producer.component.css'],
})
export class RegisterProducerComponent implements OnInit {
  UID;
  registerForm = this.formBuilder.group({
    id: '',
    loc: '',
    name: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = await this.auth.getUser();
    this.UID = user.uid;
  }

  async onSubmit() {
    console.log(this.registerForm.value);

    await this.http
      .post<any>(environment.apiUrl + 'register', {
        uid: this.UID,
        id: this.registerForm.value.id,
        name: this.registerForm.value.name,
        loc: this.registerForm.value.loc,
      })
      .toPromise();
    this.router.navigateByUrl('/producer');
    this.registerForm.reset();
  }
}

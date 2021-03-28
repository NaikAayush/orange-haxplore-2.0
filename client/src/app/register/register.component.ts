import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  type;
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
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
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
    this.router.navigateByUrl(this.type);
    this.registerForm.reset();
  }
}

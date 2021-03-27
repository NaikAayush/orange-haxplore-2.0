import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public url: string = '';
  type;
  agent: string;
  policies;
  realType;
  UID;
  regStatus;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    this.url = this.router.url;
    this.type = this.url.split('/', 2);
    console.log(this.type);
    if (this.type[1] == 'producer') {
      this.agent = 'Producer Login';
    } else if (this.type[1] == 'supplier') {
      this.agent = 'Supplier Login';
    } else if (this.type[1] == 'seller') {
      this.agent = 'Seller Login';
    }

    console.log(this.router.url);

    const user = await this.auth.getUser();
    console.log(user.uid);
  }

  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async successCallback(event) {
    var x = await event;
    console.log(x.authResult.user.uid, this.type);
    var res = await this.http
      .post<any>(environment.apiUrl + 'login', {
        uid: x.authResult.user.uid,
        type: this.type[1],
      })
      .toPromise();
    this.realType = res.data.type;
    this.regStatus = res.data.reg;
    // await this.http
    //   .post<any>(environment.apiUrl + 'login', {
    //     uid: x.authResult.user.uid,
    //     type: this.type[1],
    //   })
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.realType = data.data.type;
    //     this.regStatus = data.data.reg;
    //   });
    console.log(this.realType);
    console.log(this.regStatus);
    if (this.regStatus == 0) {
      this.router.navigateByUrl('producer/register');
    }
    if (this.realType == 'producer') {
      this.router.navigateByUrl('/producer');
    }
  }

  logOut() {
    this.afAuth.signOut();
  }
}

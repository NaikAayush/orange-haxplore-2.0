import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// import auth from 'firebase/app';
import firebase from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router
  ) {}

  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async getProducerId(uid) {
    return this.http
      .get<any>(environment.apiUrl + 'getInstituteDetails/' + uid)
      .toPromise();
  }

  logOut() {
    this.afAuth.signOut();
    this.router.navigate(['login/producer']);
  }
}

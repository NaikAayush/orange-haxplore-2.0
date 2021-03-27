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

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth) {}

  getUser(): Promise<any> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }
}

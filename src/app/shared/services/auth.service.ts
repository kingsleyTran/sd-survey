import {Injectable, NgZone} from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject } from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn: BehaviorSubject<boolean>;
  private user$: any;

  constructor(
    public firestore: AngularFirestore, // Inject Firestore service
    public auth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning

  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.setUser(user);
        localStorage.setItem('user', JSON.stringify(this.currentUser()));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  public setUser(user: any | null) {
    this.user$ = user;
  }

  public currentUser(): any | null {
    if (this.user$) {
      return this.user$;
    } else {
      return JSON.parse(localStorage.getItem('user')!);
    }
  }

  AuthLogin(provider: any) {
    return this.auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('resp = ', result);
        this.setUser(result.user);
        this.router.navigate(['admin/dashboard/categories']);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  login() {
    this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['admin/dashboard']);
    });
  }

  logout() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['admin/log-in']);
    });
  }
}

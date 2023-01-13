import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "@shared/services/auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    const currentUser = this.auth.currentUser();
    if (!currentUser) {
      this.router.navigate([`admin/log-in`]);
      return of(false);
    } else {
      console.log(currentUser);
      const subscriber$ = this.afs.collection('users', (ref) => {
        return ref.where("email", "==", currentUser.email)
      }).snapshotChanges().subscribe((resp) => {
        console.log(resp);
        if (!resp || resp.length === 0) {
          this.auth.logout();
        } else {
          const user: any = resp[0].payload.doc.data();
          if (!user.admin) {
            this.auth.logout();
          }
        }
      });
      return of(true);
    }
  }

}

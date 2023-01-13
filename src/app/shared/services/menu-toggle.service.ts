import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuToggleService {

  private emitToggleMenu = new Subject<boolean>();
  toggleMenuEmitted$ = this.emitToggleMenu.asObservable();
  toggleMenu(hidden: boolean) {
    this.emitToggleMenu.next(hidden);
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = new Subject<boolean>();

  show() {
    setTimeout( () => {
      this.isLoading.next(true);
    }, 0);
    setTimeout( () => {
      this.isLoading.next(false);
    }, 1500);
  }

  hide() {
    setTimeout( () => {
      this.isLoading.next(false);
    }, 0);
  }
}

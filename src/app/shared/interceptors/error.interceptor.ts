import {Injectable, Injector} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  // @ts-ignore
  private toastrService: ToastrService;

  constructor(
    private injector: Injector
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.toastrService = this.injector.get(ToastrService);
    return next.handle(request).pipe(
      catchError((err) => {
        this.toastrService.error(
          'Something went wrong, please check log',
          'An error occurred',
          {positionClass: 'toast-top-right'}
        );
        console.error(err);
        return throwError(err);
      })
    );
  }
}

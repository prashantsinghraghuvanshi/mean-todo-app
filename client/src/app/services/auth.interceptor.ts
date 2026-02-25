import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('auth_token');
    const authReq = token ? req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }) : req;

    // Debug: log outgoing token and Authorization header
    console.log('[AuthInterceptor] Token:', token);
    if (authReq.headers.has('Authorization')) {
      console.log('[AuthInterceptor] Outgoing request:', authReq.method, authReq.url, 'Authorization:', authReq.headers.get('Authorization'));
    } else {
      console.log('[AuthInterceptor] Outgoing request:', authReq.method, authReq.url, 'NO Authorization header');
    }

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // redirect to login on unauthorized
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}

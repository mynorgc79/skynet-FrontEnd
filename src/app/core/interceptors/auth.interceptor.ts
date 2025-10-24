import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, filter, take, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Agregar token si está disponible y no es una request de login/refresh
    const authReq = this.addTokenHeader(req);
    
    return next.handle(authReq).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    
    console.log('Interceptor - URL:', request.url);
    console.log('Interceptor - Token disponible:', !!token);
    console.log('Interceptor - Es auth request:', this.isAuthRequest(request));
    
    // No agregar token a requests de autenticación
    if (!token || this.isAuthRequest(request)) {
      console.log('Interceptor - No se agregó token');
      return request;
    }
    
    console.log('Interceptor - Token agregado a la request');
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private isAuthRequest(request: HttpRequest<any>): boolean {
    const isAuth = request.url.includes('/usuarios/login') || 
           request.url.includes('/auth/refresh') ||
           request.url.includes('/auth/register');
    
    console.log('Interceptor - isAuthRequest para', request.url, ':', isAuth);
    return isAuth;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      
      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.token);
            
            // Reintentar request original con nuevo token
            return next.handle(this.addTokenHeader(request));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            
            // Si refresh falla, logout y redirigir a login
            this.authService.logout();
            this.router.navigate(['/login']);
            
            return throwError(() => err);
          })
        );
      } else {
        // No hay refresh token, logout directo
        this.authService.logout();
        this.router.navigate(['/login']);
        return throwError(() => 'No refresh token available');
      }
    }
    
    // Si ya se está refreshing, esperar a que termine
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(this.addTokenHeader(request)))
    );
  }
}
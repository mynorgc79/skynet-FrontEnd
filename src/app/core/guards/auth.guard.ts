import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[];
  const userRole = authService.getCurrentUserRole();

  if (requiredRoles && userRole && requiredRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/dashboard']); // Redirigir al dashboard si no tiene permisos
    return false;
  }
};

// Guards específicos por rol
export const adminGuard: CanActivateFn = (route, state) => {
  return roleGuard(route, state);
};

export const supervisorGuard: CanActivateFn = (route, state) => {
  return roleGuard(route, state);
};

export const tecnicoGuard: CanActivateFn = (route, state) => {
  return roleGuard(route, state);
};
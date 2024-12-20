import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(): boolean {
    const nombreUsuario = this.cookieService.get('nombreUsuario'); 
    if (!nombreUsuario) {
      this.router.navigate(['/auth/login']); 
      return false;
    }
    return true;
  }
}

import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  isAuthenticated$: Observable<boolean>;
  user$: Observable<any>;

  constructor(private auth: AuthService) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
    this.user$ = this.auth.user$;
  }

  // Expose Auth0's login method
  login(): void {
    this.auth.loginWithRedirect();
  }

  // Expose Auth0's logout method
  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { UserService } from './user.service'; // Import the new UserService
import { take } from 'rxjs/operators'; // Import take operator

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div style="padding: 30px; font-size: 18px;">
      <p>Completing login…</p>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService // Inject the UserService
  ) {}

  ngOnInit() {
    // Handles Auth0 redirect (exchanges code → tokens)
    this.auth.handleRedirectCallback().subscribe({
      next: () => {
        // After successful authentication, get user profile and store name
        this.auth.user$.pipe(take(1)).subscribe(user => {
          if (user && user.name) {
            this.userService.setUserName(user.name);
          } else if (user && user.nickname) { // Fallback to nickname if name is not available
            this.userService.setUserName(user.nickname);
          } else {
            this.userService.setUserName('Guest'); // Default if no name/nickname
          }
          // Redirect to home or the user’s intended route
          this.router.navigateByUrl(localStorage.getItem('auth_redirect') || '/');
        });
      },
      error: (err) => {
        console.error('Auth0 callback error:', err);
        this.router.navigateByUrl('/login');
      }
    });
  }
}

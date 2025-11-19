import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Handles Auth0 redirect (exchanges code → tokens)
    this.auth.handleRedirectCallback().subscribe({
      next: () => {
        // Redirect to home or the user’s intended route
        this.router.navigateByUrl(localStorage.getItem('auth_redirect') || '/');
      },
      error: (err) => {
        console.error('Auth0 callback error:', err);
        this.router.navigateByUrl('/login');
      }
    });
  }
}

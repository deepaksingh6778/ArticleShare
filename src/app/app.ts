import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { AppAuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ArticleShare';
  private authService = inject(AppAuthService);

  isAuthenticated$ = this.authService.isAuthenticated$;
  user$ = this.authService.user$;

  login = () => this.authService.login();
  logout = () => this.authService.logout();
}

import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProtectedPageComponent } from './protected-page.component';

export const routes: Routes = [
  {
    path: 'protected',
    component: ProtectedPageComponent,
    canActivate: [AuthGuard]
  }
];

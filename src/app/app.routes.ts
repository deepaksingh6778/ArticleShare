import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProtectedPageComponent } from './protected-page.component';
import { AuthCallbackComponent } from './auth-callback.component';
import { HomeComponent } from './home/home.component';
import { ArticleDetailsComponent } from './articledetails/articledetails';
import { ExploreComponent } from './explore/explore';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'details/:id',
    component: ArticleDetailsComponent,
    pathMatch: 'full',
  },
  {
    path: 'explore',
    component: ExploreComponent,
    pathMatch: 'full',
  },
  { 
    path: "callback", 
    component: AuthCallbackComponent 
 },
  {
    path: 'protected',
    component: ProtectedPageComponent,
    canActivate: [AuthGuard]
  }
];

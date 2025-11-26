import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProtectedPageComponent } from './protected-page.component';
import { AuthCallbackComponent } from './auth-callback.component';
import { HomeComponent } from './home/home.component';
import { ArticleDetailsComponent } from './articledetails/articledetails';
import { ExploreComponent } from './explore/explore';
import { PostComponent } from './post/post';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
   {
    path: 'post',
    component: PostComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'details/:id',
    component: ArticleDetailsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'explore',
    component: ExploreComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
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

import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter,withHashLocation} from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { environment } from './../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),   
    provideAuth0({
      domain: 'dev-auf10bctliijewyd.us.auth0.com',
      clientId: 'uExvmCJ4qs4TqVIZOYjjKqJgCOD2LnL4',
      authorizationParams: {
        redirect_uri: environment.auth0.redirectUri,
        scope: 'openid profile email' 
      }
    })
  ]
};

import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { DbService } from './db.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),   
    provideAuth0({
      domain: 'dev-auf10bctliijewyd.us.auth0.com', // Replace with your Auth0 Domain
      clientId: 'uExvmCJ4qs4TqVIZOYjjKqJgCOD2LnL4', // Replace with your Auth0 Client ID
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
        scope: 'openid profile email' 
      }
    })
  ]
};

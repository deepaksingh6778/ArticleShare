import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAuth0({
      domain: 'YOUR_AUTH0_DOMAIN', // Replace with your Auth0 Domain
      clientId: 'YOUR_AUTH0_CLIENT_ID', // Replace with your Auth0 Client ID
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  ]
};

import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { IndexedDbService } from './indexed-db.service';

import { routes } from './app.routes';

const articlesToSeed = [
  { id: 1, title: "The economics behind unpaid internship", description: "Corporate companies often leverage unpaid interns...", date: "TODAY", views: "24.1k", likes: 32, image: "assets/thumb1.png", author: { name: 'Benjamin Foster', role: 'Editor & Writer' } },
  { id: 2, title: "Embark on a Cosmic Adventure", description: "The universe is full of wonders...", date: "TODAY", views: "19.4k", likes: 21, image: "assets/thumb2.png", author: { name: 'Ryan Green', role: 'Editor & Writer' } },
  { id: 3, title: "Classical musician: Build your brand on social media", description: "With social media anyone can build a brand...", author: { name: 'Anthony Adams', role: 'Editor & Writer' }, date: "TODAY", views: "12.7k", likes: 14, image: "assets/thumb3.png" },
  { id: 4, title: "3 non-Latin script languages I found the easiest", description: "Learning languages expands the mind...", author: { name: 'Sarah Jackson', role: 'Editor & Writer' }, date: "TODAY", views: "10.9k", likes: 9, image: "assets/thumb4.png" }
];

export function initializeDatabase(indexedDbService: IndexedDbService): () => Promise<void> {
  return async () => {
    await indexedDbService.openDatabase();
    const articles = await indexedDbService.getAll('articles');
    if (articles.length === 0) {
      console.log('No articles found in DB, seeding...');
      for (const article of articlesToSeed) {
        await indexedDbService.add('articles', article);
      }
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    IndexedDbService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeDatabase,
      deps: [IndexedDbService],
      multi: true
    },
    provideAuth0({
      domain: 'dev-auf10bctliijewyd.us.auth0.com', // Replace with your Auth0 Domain
      clientId: 'uExvmCJ4qs4TqVIZOYjjKqJgCOD2LnL4', // Replace with your Auth0 Client ID
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`
      }
    })
  ]
};

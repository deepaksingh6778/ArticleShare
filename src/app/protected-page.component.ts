import { Component } from '@angular/core';

@Component({
  selector: 'app-protected-page',
  standalone: true,
  template: `
    <h2>This is a protected page!</h2>
    <p>Only authenticated users can see this content.</p>
  `
})
export class ProtectedPageComponent { }
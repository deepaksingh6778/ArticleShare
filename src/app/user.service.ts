import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service to manage the current user's session information.
 * This includes the user's name, which can be accessed by other components.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // BehaviorSubject to hold the current user's name, initially null.
  // It emits the current value to new subscribers.
  private _userName = new BehaviorSubject<string | null>(null);
  // Public observable for other components to subscribe to user name changes.
  public userName$: Observable<string | null> = this._userName.asObservable();

  constructor() {
    // On service initialization, try to load the user name from local storage
    // to maintain session across page refreshes.
    const storedUserName = localStorage.getItem('currentUserName');
    if (storedUserName) {
      this._userName.next(storedUserName);
    }
  }

  // Sets the user's name and stores it in local storage.
  // If name is null, it removes the name from local storage.
  setUserName(name: string | null) {
    this._userName.next(name);
    if (name) {
      localStorage.setItem('currentUserName', name);
    } else {
      localStorage.removeItem('currentUserName');
    }
  }

  /**
   * Synchronously gets the current value of the user's name.
   * @returns The current user's name, or null if not set.
   */
  getUserName(): string | null {
    return this._userName.getValue();
  }
}
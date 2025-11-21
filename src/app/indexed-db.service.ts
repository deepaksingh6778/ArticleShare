import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'ArticleShareDB';
  private dbVersion = 3;
  private db: IDBDatabase | null = null;

  constructor() {}

  /**
   * Opens the IndexedDB database. If the database does not exist, it will be created.
   * If the version is higher than the existing one, onupgradeneeded will be triggered.
   */
  async openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve();
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('articles')) {
          db.createObjectStore('articles', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('comments')) {
          db.createObjectStore('comments', { keyPath: 'id' });
        }
        console.log('IndexedDB upgrade complete.');
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('IndexedDB opened successfully.');
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  /**
   * Retrieves an object store from the database.
   * @param storeName The name of the object store.
   * @param mode The transaction mode ('readonly' or 'readwrite').
   * @returns A promise that resolves with the IDBObjectStore.
   */
  private async getObjectStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.openDatabase();
    }
    if (!this.db) {
      throw new Error('Database not opened.');
    }
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  /**
   * Adds data to an object store.
   * @param storeName The name of the object store.
   * @param data The data to add.
   * @returns A promise that resolves with the key of the newly added record.
   */
  async add<T>(storeName: string, data: T): Promise<number> {
    const store = await this.getObjectStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieves data from an object store by its key.
   * @param storeName The name of the object store.
   * @param key The key of the record to retrieve.
   * @returns A promise that resolves with the retrieved data, or undefined if not found.
   */
  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const store = await this.getObjectStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieves all data from an object store.
   * @param storeName The name of the object store.
   * @returns A promise that resolves with an array of all records.
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    const store = await this.getObjectStore(storeName, 'readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Updates an existing record in an object store.
   * @param storeName The name of the object store.
   * @param data The data to update. It must contain the keyPath property (e.g., 'id').
   * @returns A promise that resolves when the update is complete.
   */
  async update<T extends { id: IDBValidKey }>(storeName: string, data: T): Promise<void> {
    const store = await this.getObjectStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Deletes a record from an object store by its key.
   * @param storeName The name of the object store.
   * @param key The key of the record to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const store = await this.getObjectStore(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
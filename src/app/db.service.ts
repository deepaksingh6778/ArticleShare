// ...existing code...
import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({ providedIn: 'root' })
export class DbService {
  
  private dbPromise: Promise<IDBPDatabase<any>>;

  constructor() {
    this.dbPromise = openDB('ArticleShare-db', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // This runs if the database doesn't exist or the version is lower than 1.
        if (oldVersion < 1) {
          // Create all object stores for the initial version.
          db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
          db.createObjectStore('comments', { keyPath: 'postId' });
          db.createObjectStore('authors', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  async getComments(postId: number): Promise<Array<any>> {
    const db = await this.dbPromise;
    const entry = await db.get('comments', postId);
    return entry && entry.comments ? entry.comments : [];
  }

  async saveComments(postId: number, comments: Array<any>): Promise<void> {
    const db = await this.dbPromise;
    await db.put('comments', { postId, comments });
  }

  async getAllAuthors() {
    const db = await this.dbPromise;
    return db.getAll('authors');
  }
 
  async seedDefaultPosts() {
    const db = await this.dbPromise;
    const count = await db.count('items');
    if (count === 0) {
      const articlesToSeed = [
            { title: "The economics behind unpaid internship", description: "Corporate companies often leverage unpaid interns...", date: "TODAY", views: 10, likes: 32, image: "assets/thumb1.png", author: { name: 'Benjamin Foster', role: 'Editor & Writer' },tags: ["Blockchain", "Finance"] },
            { title: "Embark on a Cosmic Adventure", description: "The universe is full of wonders...", date: "TODAY", views: 19, likes: 21, image: "assets/thumb2.png", author: { name: 'Ryan Green', role: 'Editor & Writer' },tags: ["Blockchain", "Finance"] },
            { title: "Classical musician: Build your brand on social media", description: "With social media anyone can build a brand...", author: { name: 'Anthony Adams', role: 'Editor & Writer' }, date: "TODAY", views: 12, likes: 14, image: "assets/thumb3.png",tags: ["Blockchain", "Finance"]},
            { title: "3 non-Latin script languages I found the easiest", description: "Learning languages expands the mind...", author: { name: 'Sarah Jackson', role: 'Editor & Writer' }, date: "TODAY", views: 11, likes: 9, image: "assets/thumb4.png",tags: ["Blockchain", "Finance"] }
            ,{
                title: "Demystifying Blockchain: Was it intentionally made confusing?",
                description: "For many, the concept of blockchain can seem perplexing and shrouded in mystery...",
                author: { name: "Benjamin Foster", role: "Editor & Writer" },
                date: "TODAY",
                views: 20,
                likes: 94,
                image: "assets/featured.png",
                tags: ["Blockchain", "Finance"]
            }
            ];
      for (const article of articlesToSeed) {
        await db.add('items', article);
      }      
    }
  }

  async seedDefaultAuthors() {
    const db = await this.dbPromise;
    const count = await db.count('authors');
    const defaultAuthors = [
      { name: 'Alexander Hughes', tag: 'Sci-Fi', views: 300 },
      { name: 'Christopher Brown', tag: 'Tech', views: 900 },
      { name: 'Sophia Anderson', tag: 'Fashion', views: 300 },
      { name: 'Deepak Singh', tag: 'Tech', views: 350 }
    ];
    if (count === 0) {
      for (const author of defaultAuthors) {
        await db.add('authors', author);
      }
    }
  }

  async addItem(item: any) {
    const db = await this.dbPromise;
    return db.add('items', item);
  }

  async getItem(id: number) {
    const db = await this.dbPromise;
    return db.get('items', id);
  }

  async getAllItems() {
    const db = await this.dbPromise;
    return db.getAll('items');
  }

  async deleteItem(id: number) {
    const db = await this.dbPromise;
    return db.delete('items', id);
  }  
   async updateItem(item: any): Promise<any> {
    // This is a generic update. The calling function needs to know the store.
    // For comments, it's better to use a specific method like saveComments.
    const db = await this.dbPromise;    
    return db.put('items', item); // put() will update the item if it exists, or add it if it does not.
  }
}
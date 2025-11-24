// ...existing code...
import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({ providedIn: 'root' })
export class DbService {
  async getUserByEmail(email: string) {
    const db = await this.dbPromise;
    return db.get('users', email);
  }
  private dbPromise: Promise<IDBPDatabase<any>>;

  constructor() {
    this.dbPromise = openDB('ArticleShare-db', 3, {
      upgrade(db, oldVersion, newVersion) {
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
        }     
        if (!db.objectStoreNames.contains('comments')) {
          db.createObjectStore('comments', { keyPath: 'postId' });
        }
      },
    });
    //this.seedDefaultUsers();
  }

  async getComments(postId: number): Promise<Array<{ user: string; text: string }>> {
    const db = await this.dbPromise;
    const entry = await db.get('comments', postId);
    return entry && entry.comments ? entry.comments : [];
  }

  async saveComments(postId: number, comments: Array<{ user: string; text: string }>): Promise<void> {
    const db = await this.dbPromise;
    await db.put('comments', { postId, comments });
  }

 
  async seedDefaultPosts() {
    const db = await this.dbPromise;
    const count = await db.count('items');
    if (count === 0) {
      const articlesToSeed = [
            { title: "The economics behind unpaid internship", description: "Corporate companies often leverage unpaid interns...", date: "TODAY", views: "24.1k", likes: 32, image: "assets/thumb1.png", author: { name: 'Benjamin Foster', role: 'Editor & Writer' },tags: ["Blockchain", "Finance"] },
            { title: "Embark on a Cosmic Adventure", description: "The universe is full of wonders...", date: "TODAY", views: "19.4k", likes: 21, image: "assets/thumb2.png", author: { name: 'Ryan Green', role: 'Editor & Writer' },tags: ["Blockchain", "Finance"] },
            { title: "Classical musician: Build your brand on social media", description: "With social media anyone can build a brand...", author: { name: 'Anthony Adams', role: 'Editor & Writer' }, date: "TODAY", views: "12.7k", likes: 14, image: "assets/thumb3.png",tags: ["Blockchain", "Finance"]},
            { title: "3 non-Latin script languages I found the easiest", description: "Learning languages expands the mind...", author: { name: 'Sarah Jackson', role: 'Editor & Writer' }, date: "TODAY", views: "10.9k", likes: 9, image: "assets/thumb4.png",tags: ["Blockchain", "Finance"] }
            ,{
                title: "Demystifying Blockchain: Was it intentionally made confusing?",
                description: "For many, the concept of blockchain can seem perplexing and shrouded in mystery...",
                author: { name: "Benjamin Foster", role: "Editor & Writer" },
                date: "TODAY",
                views: "1.2M",
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
}
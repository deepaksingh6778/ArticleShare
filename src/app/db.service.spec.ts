import { TestBed } from '@angular/core/testing';
import { DbService } from './db.service';

// Mock IndexedDB using idb
class MockDB {
  private stores: Record<string, any> = {};
  constructor() {
    this.stores['authors'] = {};
    this.stores['items'] = {};
    this.stores['comments'] = {};
  }
  get(store: string, key: any) {
    return Promise.resolve(this.stores[store][key] || null);
  }
  put(store: string, value: any) {
    this.stores[store][value.email || value.postId || value.id] = value;
    return Promise.resolve();
  }
  add(store: string, value: any) {
    const key = value.id || Object.keys(this.stores[store]).length + 1;
    value.id = key;
    this.stores[store][key] = value;
    return Promise.resolve(key);
  }
  getAll(store: string) {
    return Promise.resolve(Object.values(this.stores[store]));
  }
  delete(store: string, key: any) {
    delete this.stores[store][key];
    return Promise.resolve();
  }
  count(store: string) {
    return Promise.resolve(Object.keys(this.stores[store]).length);
  }
}

describe('DbService', () => {
  let service: DbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new DbService();
    // Override dbPromise to use mock
    (service as any).dbPromise = Promise.resolve(new MockDB());
  });

   it('should add and get item', async () => {
    const item = { title: 'Test Item', id: 1 };
    await service.addItem(item);
    const result = await service.getItem(1);
    expect(result).toEqual(item);
  });

  it('should save and get comments', async () => {
    const comments = [ { user: 'Bob', text: 'Nice!' } ];
    await service.saveComments(1, comments);
    const result = await service.getComments(1);
    expect(result).toEqual(comments);
  });

  it('should delete item', async () => {
    const item = { title: 'Delete Me', id: 2 };
    await service.addItem(item);
    await service.deleteItem(2);
    const result = await service.getItem(2);
    expect(result).toBeNull();
  });

  it('should get all items', async () => {
    await service.addItem({ title: 'A', id: 3 });
    await service.addItem({ title: 'B', id: 4 });
    const result = await service.getAllItems();
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});

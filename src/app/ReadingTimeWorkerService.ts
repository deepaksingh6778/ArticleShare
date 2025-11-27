import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadingTimeWorkerService {
  private worker: Worker | null = null;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('./reading-time.worker.ts', import.meta.url),
        { type: 'module' }
      );
      console.log('ReadingTimeWorkerService: Web Worker initialized.');
    }
  }

  estimateReadingTime(content: string): Observable<{ wordCount: number; readingTime: string }> {
    return new Observable(observer => {
      
      if (!this.worker) {
        // Fallback if Web Worker is not supported
        const wordCount = content.split(/\s+/).filter(Boolean).length;

        let readingTime = '';
        const seconds = Math.ceil((wordCount / 200) * 60);

        if (seconds < 60) {
          readingTime = `${seconds} sec`;
        } else {
          readingTime = `${Math.ceil(seconds / 60)} min`;
        }

        observer.next({ wordCount, readingTime });
        observer.complete();
        return;
      }

      this.worker.onmessage = ({ data }) => {
        observer.next(data);
        observer.complete();
      };

      this.worker.postMessage({ content });

      // IMPORTANT: Do NOT terminate worker here (reuse it)
      return () => {};
    });
  }
}

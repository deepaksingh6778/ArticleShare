import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DbService } from './db.service';
import { Article } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private dbService: DbService) { }

  getFeaturedArticle(): Observable<Article | undefined> {
    return from(this.dbService.getAllItems()).pipe(
      map(articles => {
        if (articles && articles.length > 0) {
          // Assuming the last article is the featured one
          return articles[articles.length - 1];
        }
        return undefined;
      })
    );
  }

  getArticles(sortBy: string, page: number, pageSize: number): Observable<Article[]> {
    return from(this.dbService.getAllItems()).pipe(
      map(articles => {
        let sortedArticles = [...articles];

        switch (sortBy) {
          case 'latest':
            sortedArticles.sort((a, b) => b.id - a.id);
            break;
          case 'popular':
            sortedArticles.sort((a, b) => b.likes - a.likes);
            break;
          case 'editor':
            // Assuming 'editor's pick' is based on a flag, which is not present.
            // Let's sort by views as a proxy.
            sortedArticles.sort((a, b) => b.views - a.views);
            break;
          default:
            sortedArticles.sort((a, b) => b.id - a.id);
            break;
        }

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return sortedArticles.slice(startIndex, endIndex);
      })
    );
  }
}
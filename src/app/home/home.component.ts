import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../article.service';
import { Article } from '../article.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DbService } from '../db.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private articleService: ArticleService, private dbService: DbService, private cdr: ChangeDetectorRef) {
    this.searchSubject.pipe(
      debounceTime(300), // Wait for 300ms after the last event
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe(() => {
      this.loadInitialArticles();
    });
  }

  articles: Article[] = [];
  featuredArticle: Article | undefined = undefined;
  page: number = 1;
  allArticlesLoaded: boolean = false;
  sortBy = 'latest';
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  async ngOnInit() {
    await this.dbService.seedDefaultPosts();
    await this.dbService.seedDefaultAuthors();
    this.loadInitialArticles();
    this.loadFeaturedArticle();
  }

  pageSize: number = 3;
  loadInitialArticles(): void {
    this.page = 1;
    this.allArticlesLoaded = false;
    this.articleService.getArticles(this.sortBy, this.page, this.pageSize, this.searchTerm).subscribe(articles => {
      this.articles = articles;
      if (articles.length < this.pageSize) {
        this.allArticlesLoaded = true;
      }
      this.cdr.detectChanges();
    });
  }

  loadFeaturedArticle() : void{
    this.articleService.getFeaturedArticle().subscribe(article => {
      this.featuredArticle = article;
      this.cdr.detectChanges();
    });
  }

  changeSort(sortBy: string): void {
    this.sortBy = sortBy;
    this.loadInitialArticles();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  loadMore(): void {
    this.page++;
    this.articleService.getArticles(this.sortBy, this.page, this.pageSize, this.searchTerm).subscribe(newArticles => {
      if (newArticles.length > 0) {
        this.articles.push(...newArticles);
      }
      
      if (newArticles.length < this.pageSize) {
        this.allArticlesLoaded = true;
      }
      this.cdr.detectChanges();
    });
  }

  navigateToExplore() {
    this.router.navigate(['/explore']);
  }

  navigateToPost() {
    this.router.navigate(['/post']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

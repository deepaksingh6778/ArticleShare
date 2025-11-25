import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../article.service';
import { Article } from '../article.model';
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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home')) {
        this.loadInitialArticles();
      }
    });
  }

  articles: Article[] = [];
  featuredArticle: Article | undefined = undefined;
  page: number = 1;
  pageSize: number = 3;
  allArticlesLoaded: boolean = false;
  sortBy = 'latest';

  async ngOnInit() {
    await this.dbService.seedDefaultPosts();
    await this.dbService.seedDefaultAuthors();
    this.loadInitialArticles();
    this.loadFeaturedArticle();
  }

   loadInitialArticles(): void {
    this.page = 1;
    this.allArticlesLoaded = false;
    this.articleService.getArticles(this.sortBy, this.page, this.pageSize).subscribe(articles => {
      this.articles = articles;
      if (articles.length < this.pageSize) {
        this.allArticlesLoaded = true;
      }
    });
  }

  loadFeaturedArticle(): void {
    this.articleService.getFeaturedArticle().subscribe(article => {
      this.featuredArticle = article;
    });
  }

  changeSort(sortBy: string): void {
    this.sortBy = sortBy;
    this.loadInitialArticles();
  }

  loadMore(): void {
    this.page++;
    this.articleService.getArticles(this.sortBy, this.page, this.pageSize).subscribe(newArticles => {
      if (newArticles.length > 0) {
        this.articles.push(...newArticles);
      }
      
      if (newArticles.length < this.pageSize) {
        this.allArticlesLoaded = true;
      }
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

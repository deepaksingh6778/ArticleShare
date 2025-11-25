import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DbService } from '../db.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private dbService: DbService, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home')) {
        this.loadArticles();
      }
    });
  }

  articles: any[] = [];
  featuredArticle: any = null;

  async ngOnInit() {
    await this.dbService.seedDefaultPosts();
    await this.dbService.seedDefaultAuthors();
    await this.loadArticles();
  }

  async loadArticles() {
    const articlesFromDb = await this.dbService.getAllItems();
    if (articlesFromDb && articlesFromDb.length > 0) {
      this.articles = articlesFromDb.sort((a, b) => b.id - a.id);
      this.featuredArticle = this.articles[this.articles.length - 1];
    }
    this.cdr.detectChanges();
  }

  sortBy = 'latest';
  
  changeSort(value: string) {
    this.sortBy = value;
    // add future sorting logic
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

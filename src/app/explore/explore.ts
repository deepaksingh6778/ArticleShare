import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './explore.html',
  styleUrls: ['./explore.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit {
  constructor(private dbService: DbService, private cdr: ChangeDetectorRef, private router: Router) {}

  trending = ['Everything Explained', 'Tech Reads', 'Family Therapy'];

  readersChoice: any[] = [];

  authors : any[] = [];

  async ngOnInit() {
    await this.loadReadersChoice();
    await this.loadTopAuthors();
  }

  async loadReadersChoice() {
    const allArticles = await this.dbService.getAllItems();
    if (allArticles && allArticles.length > 0) {
      allArticles.sort((a, b) => this.parseViews(b.views) - this.parseViews(a.views));
      this.readersChoice = allArticles.slice(0, 3);
      this.cdr.markForCheck(); // Manually trigger change detection
    }
  }

  async loadTopAuthors() {
    const allArticles = await this.dbService.getAllItems(); //
    if (allArticles && allArticles.length > 0) { //
      // Sort all articles by views in descending order
      allArticles.sort((a, b) => this.parseViews(b.views) - this.parseViews(a.views)); //

      // Get the top 2 articles
      const topArticles = allArticles.slice(0, 2); //

      // Construct the new authors array with article views and tags
      this.authors = topArticles.map(article => ({ //
        articleId: article.id, // Assuming 'id' is the unique identifier for the article
        name: article.author.name, // Author name from the article
        views: this.parseViews(article.views), // Parsed views from the article
        tag: article.tags[0] || [], // Tags from the article, default to empty array if undefined
      }));

      this.cdr.markForCheck(); //
    }
  }

  navigateToArticleDetails(articleId: string) {
    if (articleId) {
      this.router.navigate(['/details', articleId]);
    }
  }

  parseViews(views: string | number): number {
    if (typeof views === 'number') {
      return views;
    }
    const value = parseFloat(views.replace(/,/g, ''));
    if (views.toLowerCase().includes('m')) {
      return value * 1000000;
    }
    if (views.toLowerCase().includes('k')) {
      return value * 1000;
    }
    return value;
  }

   goBack() {
    window.history.back();
  }
}

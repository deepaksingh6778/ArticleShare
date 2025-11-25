import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../db.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule
import { ArticleService } from '../article.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Article, Author } from '../article.model';

// Define a new interface for authors displayed in the explore component's "Rising authors" section
// This interface includes properties derived from articles, and potentially 'role' if required by the compiler.
interface ExploreAuthorDisplay {
  articleId: number; // The ID of the article that made them "rising"
  name: string;
  views: number;
  tag: string;
  // Based on the error message "Property 'role' is missing ... but required in type 'Author'",
  // it seems the 'Author' type in the compilation environment has a 'role' property.
  // Adding it here as optional to satisfy the type checker for now.
  role?: string;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Added RouterModule
  templateUrl: './explore.html',
  styleUrls: ['./explore.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit {
  constructor(
    private dbService: DbService, 
    private cdr: ChangeDetectorRef, 
    private router: Router,
    private articleService: ArticleService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performSearch();
    });
  }

  trending: string[] = ['design', 'tech', 'crypto'];
  readersChoice: Article[] = [];
  authors: ExploreAuthorDisplay[] = []; // Changed type to ExploreAuthorDisplay[]

  searchTerm: string = '';
  searchType: 'articles' | 'authors' = 'articles';
  private searchSubject = new Subject<string>();

  async ngOnInit() {
    await this.dbService.seedDefaultPosts();
    await this.dbService.seedDefaultAuthors();
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.articleService.getArticles('popular', 1, 3).subscribe(articles => {
      this.readersChoice = articles;
      this.cdr.markForCheck();
    });
    // Populate the initial "Rising authors" section using loadTopAuthors
    this.loadTopAuthors();
  }

  async loadTopAuthors() {
    const allArticles = await this.dbService.getAllItems(); //
    if (allArticles && allArticles.length > 0) { //
      // Sort all articles by views in descending order
      allArticles.sort((a, b) => this.parseViews(b.views) - this.parseViews(a.views)); //
      // Get the top 2 articles
      const topArticles = allArticles.slice(0, 2); //
      // Construct the new authors array with article views and tags
      this.authors = topArticles.map(article => ({
        articleId: article.id, // Assuming 'id' is the unique identifier for the article
        name: article.author.name, // Author name from the article
        views: this.parseViews(article.views), // Parsed views from the article
        tag: article.tags[0] || [], // Tags from the article, default to empty array if undefined
      }));

      this.cdr.markForCheck(); //
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  performSearch(): void {
    if (this.searchType === 'articles') {
      this.articleService.getArticles('latest', 1, 10, this.searchTerm).subscribe(articles => {
        this.readersChoice = articles;
        this.authors = []; // Clear authors when searching for articles
        this.cdr.markForCheck();
      });
    } else { // searchType === 'authors'
      this.articleService.getAuthors(this.searchTerm).subscribe(basicAuthors => {
        // Transform basic Author objects (id, name) into ExploreAuthorDisplay objects.
        // Placeholder values are used for properties not available from basic authors.
        this.authors = basicAuthors.map(author => ({
          articleId: 0, // Placeholder: basic author search doesn't link to a specific article
          name: author.name,
          views: 0, // Placeholder
          tag: 'General', // Placeholder
          // role: 'Author', // Placeholder if 'role' is truly required
        }));
        this.readersChoice = []; // Clear articles when searching for authors
        this.cdr.markForCheck();
      });
    }
  }


  navigateToArticleDetails(articleId: number) {
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
    this.router.navigate(['/']);
  }
}

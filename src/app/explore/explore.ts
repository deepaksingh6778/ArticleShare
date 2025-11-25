import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../db.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './explore.html',
  styleUrls: ['./explore.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit {
  constructor(private dbService: DbService, private cdr: ChangeDetectorRef) {}

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
    // Assuming you have a method to get authors, otherwise we use the seeded data.
    const allAuthors = await this.dbService.getAllAuthors();
    console.log('All Authors:', allAuthors);
    if (allAuthors && allAuthors.length > 0) {
      // Sort by views in descending order
      allAuthors.sort((a, b) => this.parseViews(b.views) - this.parseViews(a.views));
      this.authors = allAuthors.slice(0, 3);
      this.cdr.markForCheck();
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

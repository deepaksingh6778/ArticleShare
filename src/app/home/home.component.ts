import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IndexedDbService } from '../indexed-db.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private indexedDbService: IndexedDbService, private cdr: ChangeDetectorRef) {}

  articles: any[] = [];
  featuredArticle: any = null;

  async ngOnInit() {
    const articlesFromDb = await this.indexedDbService.getAll('articles');
    if (articlesFromDb && articlesFromDb.length > 0) {
      this.articles = articlesFromDb;
      this.featuredArticle = this.articles[this.articles.length - 1];
    }
    this.cdr.detectChanges();
  }

  sortBy = 'latest';
  
  changeSort(value: string) {
    this.sortBy = value;
    // add future sorting logic
  }

  navigateToPost() {
    this.router.navigate(['/post']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

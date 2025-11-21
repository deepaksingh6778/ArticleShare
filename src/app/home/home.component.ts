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

  async ngOnInit() {
    this.articles = await this.indexedDbService.getAll('articles');
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  sortBy = 'latest';

  featuredArticle = {
    title: "Demystifying Blockchain: Was it intentionally made confusing?",
    description: "For many, the concept of blockchain can seem perplexing and shrouded in mystery...",
    author: "Benjamin Foster",
    date: "TODAY",
    tags: ["Blockchain", "Finance"],
    views: "1.2M",
    likes: 94,
    image: "assets/featured.png"
  };
  
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

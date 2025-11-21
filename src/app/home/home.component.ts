import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent {

 constructor(private router: Router) {}

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

  articles = [
    {
      id: 1,
      title: "The economics behind unpaid internship",
      description: "Corporate companies often leverage unpaid interns...",
      date: "TODAY",
      views: "24.1k",
      likes: 32,
      image: "assets/thumb1.png",
      author: {
      name: 'Benjamin Foster',
      role: 'Editor & Writer'
      }
    },
    {
      id: 2,
      title: "Embark on a Cosmic Adventure",
      description: "The universe is full of wonders...",
      date: "TODAY",
      views: "19.4k",
      likes: 21,
      image: "assets/thumb2.png",
      author: {
      name: 'Ryan Green',
      role: 'Editor & Writer'
      }
    },
    {
      id: 3,
      title: "Classical musician: Build your brand on social media",
      description: "With social media anyone can build a brand...",
      author: {
      name: 'Anthony Adams',
      role: 'Editor & Writer'
      },
      date: "TODAY",
      views: "12.7k",
      likes: 14,
      image: "assets/thumb3.png"
    },
    {
      id: 4,
      title: "3 non-Latin script languages I found the easiest",
      description: "Learning languages expands the mind...",
      author: {
      name: 'Sarah Jackson',
      role: 'Editor & Writer'
      },
      date: "TODAY",
      views: "10.9k",
      likes: 9,
      image: "assets/thumb4.png"
    }
  ];

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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { DbService } from '../db.service';

@Component({
  selector: 'app-articledetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articledetails.html',
  styleUrl: './articledetails.scss',
})
export class ArticleDetailsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private dbService: DbService) {}

  article = {
    id: 1, // Added ID for IndexedDB
    tags: ['Blockchain', 'Technology'],
    date: 'Jun 27, 2024',
    title: 'Demystifying Blockchain: Was it intentionally made confusing?',
    description: 'For many, the concept of blockchain can seem perplexing and shrouded in mystery. Was it intentionally designed to be this way?',
    image: 'assets/featured.png',
    author: {
      name: 'Benjamin Foster',
      role: 'Editor & Writer',
    },
    views: '1.8M',
    likes: '6.4K',
  };

  recommended = [
    { title: 'The Future of Decentralized Finance', image: 'assets/defaultimage.png' },
    { title: 'Understanding Smart Contracts', image: 'assets/defaultimage.png' },
    { title: 'How NFTs are Changing the Art World', image: 'assets/defaultimage.png' },
  ];

  showComments = true;

  comments = [
    {
      id: 1, // Added ID for IndexedDB
      author: 'Anna',
      time: '12:03 PM',
      text: 'Ut in ad laborum minim aliqua mollit proident enim adipiscing...',
      replies: [],
    },
    {
      id: 2, // Added ID for IndexedDB
      author: 'John',
      time: '08:10 AM',
      text: 'Id ullamco qui tempor consectetur fugiat magna officia eiusmod...',
      replies: [
        {
          id: 1, // Added ID for IndexedDB
          author: 'Benjamin Foster',
          time: '08:20 AM',
          role: 'Author',
          text: 'Ipsum anim est consequat commodo reprehenderit mollit enim...',
        },
      ],
    },
    {
      id: 3, // Added ID for IndexedDB
      author: 'Lisa',
      time: '10:50 AM',
      text: 'Anim aute ea ad dolore et enim aute duis laboris officia...',
      replies: [],
    },
  ];

  async ngOnInit() {
    // Get the 'id' from the route parameters
    this.route.paramMap.subscribe(async params => {
      const articleId = params.get('id');
      if (articleId) {
        this.article.id = parseInt(articleId, 10);
      }
    });

    await this.loadArticleAndComments();
  }

  async loadArticleAndComments() {
    // Try to load article from IndexedDB
    const storedArticle = await this.dbService.getItem(this.article.id); // Use the article.id from route
    if (storedArticle) {
      this.article = { ...this.article, ...storedArticle };
    } else {
      // If not found, add the default article to IndexedDB
      await this.dbService.addItem(this.article);
    }

    // Try to load comments from IndexedDB
    const storedComments = await this.dbService.getComments(this.article.id); // Use the article.id from route);
    if (storedComments && storedComments.length > 0) {
      this.comments = storedComments;
    } else {
      // If not found, add the default comments to IndexedDB
      for (const comment of this.comments) {
        await this.dbService.addItem(comment);
      }
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  goBack() {
    window.history.back();
  }
}

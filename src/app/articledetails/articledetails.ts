import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { DbService } from '../db.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-articledetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articledetails.html',
  styleUrl: './articledetails.scss',
})
export class ArticleDetailsComponent implements OnInit {
  commentCount: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private dbService: DbService, private userService: UserService, private cdr: ChangeDetectorRef) {}

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

  showComments = false;

  allComments: any[] = [];
  comments: any[] = [];
  commentsPerPage = 3;
  currentPage = 0;
  hasMoreComments = false;

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
      console.log('Loaded article from IndexedDB:', storedArticle);
      this.article = { ...this.article, ...storedArticle };
      // Increment views
      this.article.views = this.incrementViews(this.article.views);
      await this.dbService.updateItem(this.article); // Save the updated article
    } 

    // Try to load comments from IndexedDB
    const storedComments = await this.dbService.getComments(this.article.id); // Use the article.id from route);
    if (storedComments && storedComments.length > 0) {
      this.allComments = storedComments;
      this.commentCount = this.allComments.length; // Update the comment count
      this.loadInitialComments();
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  incrementViews(views: string | number): string {
    let numViews: number;
    if (typeof views === 'string') {
      const value = parseFloat(views.replace(/,/g, ''));
      if (views.toLowerCase().includes('m')) {
        numViews = value * 1000000;
      } else if (views.toLowerCase().includes('k')) {
        numViews = value * 1000;
      } else {
        numViews = value;
      }
    } else {
      numViews = views;
    }

    numViews++;
    return numViews.toLocaleString(); // Format with commas
  }

  async incrementLikes() {
    let numLikes: number;
    if (typeof this.article.likes === 'string') {
      const value = parseFloat(this.article.likes.replace(/,/g, ''));
      if (this.article.likes.toLowerCase().includes('m')) {
        numLikes = value * 1000000;
      } else if (this.article.likes.toLowerCase().includes('k')) {
        numLikes = value * 1000;
      } else {
        numLikes = value;
      }
    } else {
      numLikes = this.article.likes;
    }

    numLikes++;
    this.article.likes = numLikes.toLocaleString();

    await this.dbService.updateItem(this.article);
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  goBack() {
    window.history.back();
  }

  newCommentText: string = '';
  newReplyText: string = '';
  replyingToCommentId: number | undefined = undefined;

  async postComment() { 
    if (this.newCommentText && this.newCommentText.trim() !== '') {
      const newComment = {
        id: Date.now(),
        author: this.userService.getUserName() || 'Guest',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: this.newCommentText,
        replies: [],
        articleId: this.article.id,
      };
      this.newCommentText = ''; // Reset the input field immediately
      this.allComments.unshift(newComment); // Add to the beginning of all comments
      await this.dbService.saveComments(this.article.id, this.allComments);
      this.commentCount = this.allComments.length; // Update the comment count
      this.loadInitialComments(); // Reload comments to apply pagination correctly
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  startReply(commentId: number, parentCommentId?: number) {
    this.replyingToCommentId = commentId;
  }

  cancelReply() {
    this.replyingToCommentId = undefined;
    this.newReplyText = '';
    this.cdr.detectChanges();
  }

  async postReply(parentCommentId: number, replyToId?: number) {
    if (this.newReplyText.trim()) {
      const newReply = {
        id: Date.now(),
        author: this.userService.getUserName() || 'Guest',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: this.newReplyText,
        replies: [],
        articleId: this.article.id,
        parentId: replyToId || parentCommentId,
      };

      // Find the parent comment and add the reply
      const parentComment = this.findComment(this.comments, parentCommentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(newReply); 
        await this.dbService.saveComments(this.article.id, this.allComments);
      }

      this.cancelReply();
    }
  }

  findComment(comments: any[], commentId: number): any {
    // This is a simple find; a recursive one would be needed for deeper nesting
    return comments.find(c => c.id === commentId);
  }

  loadInitialComments() {
    this.currentPage = 0;
    this.comments = [];
    this.loadMoreComments();
  }

  loadMoreComments() {
    this.currentPage++;
    const startIndex = (this.currentPage - 1) * this.commentsPerPage;
    const endIndex = startIndex + this.commentsPerPage;
    const newComments = this.allComments.slice(startIndex, endIndex);
    this.comments.push(...newComments);

    this.hasMoreComments = this.comments.length < this.allComments.length;
  }
}

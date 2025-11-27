import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { DbService } from '../db.service';
import { UserService } from '../user.service';
import { Article } from '../article.model';
import { ReadingTimeWorkerService } from '../ReadingTimeWorkerService';

@Component({
  selector: 'app-articledetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articledetails.html',
  styleUrl: './articledetails.scss',
})
export class ArticleDetailsComponent implements OnInit {
  commentCount: number = 0;
  wordCount: number | null = null;
  readingTime: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute,
     private dbService: DbService, private userService: UserService, 
     private readingTimeWorkerService: ReadingTimeWorkerService,     
     private cdr: ChangeDetectorRef) {}  

  article: Article = {} as Article;

  recommended: any[] = [];

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
        console.log('Article empty:', this.article);
        this.article.id = parseInt(articleId, 10);
      }
    });

    await this.loadArticleAndComments();
    this.cdr.detectChanges();
  }

  async loadArticleAndComments() {
    // Try to load article from IndexedDB
    const storedArticle = await this.dbService.getItem(this.article.id); // Use the article.id from route

    if (storedArticle) {
      console.log('Loaded article from IndexedDB:', storedArticle);
      this.article = { ...this.article, ...storedArticle };
      this.readingTimeWorkerService.estimateReadingTime(this.article.description)
      .subscribe(result => {
        this.wordCount = result.wordCount;
        this.readingTime = result.readingTime;
        console.log('Estimated reading time:', this.readingTime);
        console.log('Word count:', this.wordCount);
      });
      // Increment views
      this.article.views = this.incrementViews(this.article.views);
      await this.dbService.updateItem(this.article); // Save the updated article
    } 

    // Load recommended articles
    if (this.article && this.article.tags.length > 0) {
      const primaryTag = this.article.tags[0];
      const allArticles = await this.dbService.getAllItems(); // Fetch all articles

      const recommendedArticles = allArticles
        .filter(art => 
          art.id !== this.article.id && 
          art.tags && 
          art.tags.includes(primaryTag)
        )
        .sort((a, b) => this.parseMetric(b.views) - this.parseMetric(a.views))
        .slice(0, 3);

      this.recommended = recommendedArticles;
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

  private parseMetric(metric: string | number): number {
    if (typeof metric === 'number') {
      return metric;
    }
    const value = parseFloat(metric.replace(/,/g, ''));
    if (metric.toLowerCase().includes('m')) {
      return value * 1000000;
    } else if (metric.toLowerCase().includes('k')) {
      return value * 1000;
    } else {
      return value;
    }
  }

  incrementViews(views: string | number): number {
    return (this.parseMetric(views) + 1);
  }

  async incrementLikes() {
    this.article.likes = (this.parseMetric(this.article.likes) + 1);

    await this.dbService.updateItem(this.article);
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  goBack() {
    window.history.back();
  }

  navigateToArticleDetails(id: number) {
    this.router.navigate(['/details', id]);
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

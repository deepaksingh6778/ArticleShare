import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articledetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articledetails.html',
  styleUrl: './articledetails.scss',
})
export class ArticleDetailsComponent {

 constructor(private router: Router) {}

  article = {
    tag: 'Blockchain',
    date: 'Jun 27, 2024',
    title: 'Demystifying Blockchain: Was it intentionally made confusing?',
    author: {
      name: 'Benjamin Foster',
      role: 'Editor & Writer'
    },
    views: '1.8M',
    likes: '6.4K'
  };

   recommended = [
    { title: 'The Future of Decentralized Finance' },
    { title: 'Understanding Smart Contracts' },
    { title: 'How NFTs are Changing the Art World' }
  ];

  showComments = true;

  comments = [
    {
      id: 1,
      author: 'Anna',
      time: '12:03 PM',
      text: 'Ut in ad laborum minim aliqua mollit proident enim adipiscing...',
      replies: []
    },
    {
      id: 2,
      author: 'John',
      time: '08:10 AM',
      text: 'Id ullamco qui tempor consectetur fugiat magna officia eiusmod...',
      replies: [
        {
          author: 'Benjamin Foster',
          time: '08:20 AM',
          role: 'Author',
          text: 'Ipsum anim est consequat commodo reprehenderit mollit enim...',
        }
      ]
    },
    {
      id: 3,
      author: 'Lisa',
      time: '10:50 AM',
      text: 'Anim aute ea ad dolore et enim aute duis laboris officia...',
      replies: []
    }
  ];

  toggleComments() {
    this.showComments = !this.showComments;
  }

   goBack() {
    window.history.back();
  }
}

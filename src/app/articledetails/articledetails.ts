import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-articledetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articledetails.html',
  styleUrl: './articledetails.scss',
})
export class ArticleDetailsComponent {

  article = {
    tag: 'Blockchain',
    date: 'Jun 27, 2024',
    title: 'Demystifying Blockchain: Was it intentionally made confusing?',
    author: {
      name: 'Benjamin Foster',
      role: 'Editor & Writer'
    },
    stats: {
      views: '1.8M',
      likes: '6.4K'
    }
  };

   recommended = [
    { title: 'The Future of Decentralized Finance' },
    { title: 'Understanding Smart Contracts' },
    { title: 'How NFTs are Changing the Art World' }
  ];
}




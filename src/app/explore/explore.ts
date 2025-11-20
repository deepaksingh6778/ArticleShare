import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.html',
  styleUrls: ['./explore.scss'],
})
export class ExploreComponent {
  trending = ['Everything Explained', 'Tech Reads', 'Family Therapy'];

  readersChoice = [
    {
      title: 'Why the heck are Gen Z-ers flocking to retro digital cameras?',
      views: 1200
    },
    {
      title: '10 food stylists from all over the world tell you how to become one',
      views: 1890
    },
    {
      title: 'Emotional Well-being: Negative vs. Positive Motivation',
      views: 760
    },
    {
      title: 'Saving does not equal “smart” personal finance management',
      views: 980
    },
  ];

  authors = [
    {
      name: 'Alexander Hughes',
      tag: 'Sci-Fi',
      views: 300,
    },
    {
      name: 'Christopher Brown',
      tag: 'Tech',
      views: 900,
    },
    {
      name: 'Sophia Anderson',
      tag: 'Fashion',
      views: 300,
    },
  ];
}

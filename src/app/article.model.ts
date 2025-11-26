export interface Author {
    name: string;
    role: string;  
    tag: string;
    views: number;
  }
  
  export interface Article {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    date: string;
    views: number;
    likes: number;
    author: Author;
  }

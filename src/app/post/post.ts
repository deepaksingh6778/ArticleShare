import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Quill from 'quill';

@Component({
  selector: 'app-post',
  standalone: true,
  templateUrl: './post.html',
  styleUrls: ['./post.scss'],
  imports: [CommonModule] 
})
export class PostComponent implements AfterViewInit, OnInit {

  thumbnailDataString: string | null = null;
  private db: any;

  ngOnInit() {
    this.initDB();
  }

  ngAfterViewInit() {
    new Quill('#editor', {
      theme: 'snow',
      placeholder: 'Write your article here...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['clean']                                         // remove formatting button
        ]
      }
    });
  }

  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.thumbnailDataString = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  private initDB() {
    const request = indexedDB.open('articlessharedb', 1);

    request.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      if (!this.db.objectStoreNames.contains('posts')) {
        this.db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
    };

    request.onerror = (event: any) => {
      console.error('Database error: ', event.target.errorCode);
    };
  }

  submit() {
    const title = (document.getElementById('postTitle') as HTMLInputElement).value;
    const category = (document.getElementById('categorySelect') as HTMLSelectElement).value;
    const content = (document.querySelector('.ql-editor') as HTMLElement).innerHTML;
    const thumbnail = this.thumbnailDataString;

    if (!title || category === 'Select category' || !content) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    const transaction = this.db.transaction(['posts'], 'readwrite');
    const store = transaction.objectStore('posts');
    const newPost = { title, category, content, thumbnail };

    const request = store.add(newPost);

    request.onsuccess = () => {
      console.log('Post added successfully', request.result);
      alert('Post submitted!');
    };

    request.onerror = () => {
      console.error('Error adding post', request.error);
      alert('There was an error submitting your post.');
    };
  }
  
   goBack() {
    window.history.back();
  }
}

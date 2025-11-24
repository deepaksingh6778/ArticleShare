import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../db.service';
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

  constructor(private dbService: DbService) {}

  async ngOnInit() {
    
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
  async submit() {
    const postTitle = (document.getElementById('postTitle') as HTMLInputElement).value;
    const categorySelect = document.getElementById('categorySelect') as HTMLSelectElement;
    const selectedCategories = Array.from(categorySelect.selectedOptions).map(option => option.value);
    const postContent = (document.querySelector('.ql-editor') as HTMLElement).innerHTML;
    const thumbnail = this.thumbnailDataString;

    if (!postTitle || selectedCategories.length === 0 || !postContent) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    try {
      // Create a new object for insertion without the 'id' property to allow auto-increment to work.      
      const postToAdd = {
        title: postTitle,
        description: postContent,
        date: "TODAY",
        views: "0",
        likes: 0,
        image: this.thumbnailDataString,
        author: { name: 'Deepak Singh', role: 'Editor & Writer' },
        tags: selectedCategories
      };
      const newId = await this.dbService.addItem(postToAdd);
      console.log('Post added successfully with id:', newId);
      alert('Post submitted!');
    } catch (error) {      
      console.error('Error adding post', error);
      alert('There was an error submitting your post.');
    }
  }
  
   goBack() {
    window.history.back();
  }
}

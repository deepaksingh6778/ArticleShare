import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../db.service';
import { UserService } from '../user.service';
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
  postTitle: string = '';
  selectedCategories: string[] = [];
  postContent: string = '';
  private quillEditor: Quill | null = null;
  private db: any;

  constructor(private dbService: DbService,private userService: UserService) {}

  async ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.quillEditor = new Quill('#editor', {
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
    // This is a temporary way to get the content from the editor.
    // In a real app, you might use the editor's events to update a model.
    this.postContent = document.querySelector('.ql-editor')?.innerHTML || '';

    const thumbnail = this.thumbnailDataString;
  
    if (!this.postTitle || this.selectedCategories.length === 0 || !this.postContent || !thumbnail) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    try {
      // Create a new object for insertion without the 'id' property to allow auto-increment to work.      
      const postToAdd = {
        title: this.postTitle,
        description: this.postContent,
        date: "TODAY",
        views: 0,
        likes: 0,
        image: this.thumbnailDataString,
        author: { name: this.userService.getUserName() || 'Guest', role: 'Editor & Writer' },
        tags: this.selectedCategories
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

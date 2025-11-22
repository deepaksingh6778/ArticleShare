import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Quill from 'quill';

@Component({
  selector: 'app-post',
  standalone: true,
  templateUrl: './post.html',
  styleUrls: ['./post.scss'],
  imports: [CommonModule] 
})
export class PostComponent implements AfterViewInit {

  thumbnailURL: string | ArrayBuffer | null = null;

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
      reader.onload = () => (this.thumbnailURL = reader.result);
      reader.readAsDataURL(file);
    }
  }

  submit() {
    const title = (document.getElementById('postTitle') as HTMLInputElement).value;
    const category = (document.getElementById('categorySelect') as HTMLSelectElement).value;
    const content = (document.querySelector('.ql-editor') as HTMLElement).innerHTML;

    console.log({ title, category, content });

    alert('Post submitted!');
  }
  
   goBack() {
    window.history.back();
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComponent } from './post';
import { DbService } from '../db.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  beforeEach(async () => {
    const dbServiceSpy = jasmine.createSpyObj('DbService', ['addItem']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserName']);

    // Prevent Quill from initializing in the test environment
    spyOn(PostComponent.prototype, 'ngAfterViewInit').and.callFake(() => {});

    TestBed.configureTestingModule({
      imports: [PostComponent, CommonModule],
      providers: [
        { provide: DbService, useValue: dbServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

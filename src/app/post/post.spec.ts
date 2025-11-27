import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComponent } from './post';
import { DbService } from '../db.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let dbServiceSpy: jasmine.SpyObj<DbService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    dbServiceSpy = jasmine.createSpyObj('DbService', ['addItem']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserName']);

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

  describe('submit', () => {
    let alertSpy: jasmine.Spy;

    beforeEach(() => {
      // Since we refactored the component, we no longer need to create mock DOM elements.
      // We can interact with the component's properties directly.
      spyOn(document, 'querySelector').and.callFake(() => {
        return document.createElement('div');
      });
      spyOn(document, 'getElementById').and.callFake((id: string) => {
        // Provide a default mock and allow tests to override with withArgs
        return null;
      });
      alertSpy = spyOn(window, 'alert');
      userServiceSpy.getUserName.and.returnValue('Test User');
    });

    it('should show an alert if required fields are missing', async () => {
      // Mock getElementById to return elements with empty values to trigger the validation.
      (document.getElementById as jasmine.Spy).withArgs('postTitle').and.returnValue({
        value: ''
      });
      (document.getElementById as jasmine.Spy).withArgs('categorySelect').and.returnValue({
        selectedOptions: []
      });
      (document.querySelector as jasmine.Spy).and.returnValue({ innerHTML: '' });

      await component.submit();
      expect(alertSpy).toHaveBeenCalledWith('Please fill out all fields before submitting.');
      expect(dbServiceSpy.addItem).not.toHaveBeenCalled();
    });

    it('should call dbService.addItem with the correct post data on successful submission', async () => {
      component.postTitle = 'Test Title';
      // This property will be used by our mock of getElementById
      (document.getElementById as jasmine.Spy).withArgs('postTitle').and.returnValue({
        value: component.postTitle
      });
      component.selectedCategories = ['Technology'];
      (document.getElementById as jasmine.Spy).withArgs('categorySelect').and.returnValue({
        selectedOptions: component.selectedCategories.map(val => ({ value: val }))
      });

      // Mock the return value for the one remaining querySelector call
      (document.querySelector as jasmine.Spy).and.returnValue({ innerHTML: '<p>Test Content</p>' });

      component.thumbnailDataString = 'data:image/png;base64,test';
      dbServiceSpy.addItem.and.resolveTo(1);

      await component.submit();

      const expectedPost = {
        title: 'Test Title',
        description: '<p>Test Content</p>',
        date: 'TODAY',
        views: 0,
        likes: 0,
        image: 'data:image/png;base64,test',
        author: { name: 'Test User', role: 'Editor & Writer' },
        tags: ['Technology']
      };

      expect(dbServiceSpy.addItem).toHaveBeenCalledWith(expectedPost);
      expect(alertSpy).toHaveBeenCalledWith('Post submitted!');
    });

    it('should show an error alert if addItem fails', async () => {
      component.postTitle = 'Test Title';
      (document.getElementById as jasmine.Spy).withArgs('postTitle').and.returnValue({
        value: component.postTitle
      });
      component.selectedCategories = ['Technology'];
      (document.getElementById as jasmine.Spy).withArgs('categorySelect').and.returnValue({
        selectedOptions: component.selectedCategories.map(val => ({ value: val }))
      });

      // Mock the return value for the one remaining querySelector call
      (document.querySelector as jasmine.Spy).and.returnValue({ innerHTML: '<p>Test Content</p>' });

      component.thumbnailDataString = 'data:image/png;base64,test';
      const error = new Error('DB Error');
      dbServiceSpy.addItem.and.rejectWith(error);

      await component.submit();

      expect(dbServiceSpy.addItem).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('There was an error submitting your post.');
    });
  });
});

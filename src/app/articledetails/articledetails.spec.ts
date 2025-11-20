import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Articledetails } from './articledetails';

describe('Articledetails', () => {
  let component: Articledetails;
  let fixture: ComponentFixture<Articledetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Articledetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Articledetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

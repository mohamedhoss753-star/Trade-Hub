import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalsettingComponent } from './personalsetting.component';

describe('PersonalsettingComponent', () => {
  let component: PersonalsettingComponent;
  let fixture: ComponentFixture<PersonalsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalsettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

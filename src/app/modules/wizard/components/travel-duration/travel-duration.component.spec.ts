import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelDurationComponent } from './travel-duration.component';

describe('TravelDurationComponent', () => {
  let component: TravelDurationComponent;
  let fixture: ComponentFixture<TravelDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelDurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

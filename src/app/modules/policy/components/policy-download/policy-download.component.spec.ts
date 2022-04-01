import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDownloadComponent } from './policy-download.component';

describe('PolicyDownloadComponent', () => {
  let component: PolicyDownloadComponent;
  let fixture: ComponentFixture<PolicyDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

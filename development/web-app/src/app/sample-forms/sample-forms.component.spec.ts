import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleFormsComponent } from './sample-forms.component';

describe('SampleFormsComponent', () => {
  let component: SampleFormsComponent;
  let fixture: ComponentFixture<SampleFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

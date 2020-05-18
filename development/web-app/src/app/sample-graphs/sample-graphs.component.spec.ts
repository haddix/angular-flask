import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleGraphsComponent } from './sample-graphs.component';

describe('SampleGraphsComponent', () => {
  let component: SampleGraphsComponent;
  let fixture: ComponentFixture<SampleGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleGraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

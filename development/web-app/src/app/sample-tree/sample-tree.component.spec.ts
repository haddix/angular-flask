import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTreeComponent } from './sample-tree.component';

describe('SampleTreeComponent', () => {
  let component: SampleTreeComponent;
  let fixture: ComponentFixture<SampleTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

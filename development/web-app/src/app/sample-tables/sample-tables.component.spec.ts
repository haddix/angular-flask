import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTablesComponent } from './sample-tables.component';

describe('SampleTablesComponent', () => {
  let component: SampleTablesComponent;
  let fixture: ComponentFixture<SampleTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

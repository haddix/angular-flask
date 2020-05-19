import { TestBed } from '@angular/core/testing';

import { GraphsService } from './graphs.service';

describe('GraphsService', () => {
  let service: GraphsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MoviesGraphsService } from './movies-graphs.service';

describe('MoviesGraphsService', () => {
  let service: MoviesGraphsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviesGraphsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

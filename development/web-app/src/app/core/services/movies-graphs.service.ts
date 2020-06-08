import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap} from 'rxjs/operators';

export interface MoviesGraphData{
  graphs:[];
}

@Injectable({
  providedIn: 'root'
})
export class MoviesGraphService {

  constructor(private http: HttpClient) { }

  getGraphData(search_terms): Observable<MoviesGraphData>{    
    return this.http.get<MoviesGraphData>('http://0.0.0.0:5000/angular-flask/movie_graphs?search_terms=' + search_terms);
  }
}

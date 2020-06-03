import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap} from 'rxjs/operators';

export interface GraphData{
  data:[];
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private http: HttpClient) { }

  getGraphData(graph_type): Observable<GraphData>{    
    return this.http.get<GraphData>('http://0.0.0.0:5000/angular-flask/get_graphs?graph_type=' + graph_type);
  }
}

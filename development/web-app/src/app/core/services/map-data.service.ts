import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap} from 'rxjs/operators';

export interface MapData{
  locations:[];
}

@Injectable({
  providedIn: 'root'
})

export class MapDataService {

  constructor(private http: HttpClient) { }

  getMapData(): Observable<MapData>{    
    return this.http.get<MapData>('http://0.0.0.0:5000/angular-flask/get_map');
  }
}

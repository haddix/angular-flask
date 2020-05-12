import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap} from 'rxjs/operators';

export interface TableData{
  rows:[];
  columns:[];
}

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  constructor(private http: HttpClient) { }

  getTableData(): Observable<TableData>{    
    return this.http.get<TableData>('http://0.0.0.0:5000/angular-flask/get_table');
  }
}

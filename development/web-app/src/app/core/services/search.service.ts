import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap} from 'rxjs/operators';

export interface SearchData{
  results:[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  _search_data:Subject<any> = new Subject<any>();
  search_data = this._search_data.asObservable();
  
  constructor(private http: HttpClient) { 

  }
  

  

  do_search(terms){    
    return this.http.get<SearchData>('http://0.0.0.0:5000/angular-flask/do_search?terms=' + terms).subscribe(
      res=>{
        this._search_data.next(res)
      },
      err=>{
        console.log(err);
      }
    )
    
  }
}

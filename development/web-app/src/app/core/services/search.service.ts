import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
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

  do_add(item){    
    console.log("IN ADD SERVICE")
    var body = new HttpParams().set("item", JSON.stringify(item));
    console.log(body);
    console.log(item)
    return this.http.post<any>('http://0.0.0.0:5000/angular-flask/do_add', body.toString(), {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe(
      res=>{
        console.log(res);
      },
      err=>{
        console.log(err);
      }
    )
    
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap} from 'rxjs/operators';

export interface UserData{
  dn:"",
  cd:""
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _user_data:Subject<any> = new Subject<any>();
  user_data = this._user_data.asObservable();

  test_data = Math.floor(Math.random() * (999999 - 100000)) + 100000;;

  constructor(private http: HttpClient) { 

  }
  

  get_user(){    
    return this.http.get<UserData>('http://0.0.0.0:5000/angular-flask/get_user').subscribe(
      res=>{
        this._user_data.next(res)
      },
      err=>{
        console.log(err);
      }
    )
    
  }


  set_favorites(movie){    
    var body = new HttpParams().set("movie", JSON.stringify(movie));

    return this.http.post<UserData>('http://0.0.0.0:5000/angular-flask/set_user_favorites', body.toString(), {headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe(
      res=>{
        this._user_data.next(res)
      },
      err=>{
        console.log(err);
      }
    )
    
  }
}

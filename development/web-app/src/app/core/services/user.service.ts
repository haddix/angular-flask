import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}

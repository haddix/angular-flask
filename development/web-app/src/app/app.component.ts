import { Component } from '@angular/core';
import {UserService} from './core/services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web-app';

  constructor(public user_svc:UserService) { 
    user_svc.get_user();
  }

  ngOnInit(): void {
  }


}

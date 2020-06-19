import { Component, OnInit } from '@angular/core';
import {UserService} from '../../core/services/user.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  user_data;
  test_data;

  constructor(public userService:UserService) { 
    this.userService._user_data.subscribe((value) => {
      console.log("USER DATA");
      console.log(this.user_data);
      this.user_data = value;
    }); 
    this.user_data = this.userService.user_data;     
    
  }

  ngOnInit() {
    this.userService.get_user(); 
  }

  

}

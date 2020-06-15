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

  constructor(public userService:UserService) { }

  ngOnInit() {
    this.test_data = this.userService.test_data;
    this.userService.user_data.subscribe((value) => {
      console.log("HIT")
      this.user_data = value
    }); 
  }

  

}

import { Component, OnInit } from '@angular/core';
import {SearchService, SearchData} from '../../core/services/search.service';
import {UserService} from '../../core/services/user.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  search_data;
  
  constructor(public searchService:SearchService, public userService:UserService) {
      
  }

  ngOnInit(): void {    
    this.searchService.search_data.subscribe((value) => {
      this.search_data = value
    });  
  }

  set_movie(movie){
    this.userService.set_favorites(movie);
  }


}

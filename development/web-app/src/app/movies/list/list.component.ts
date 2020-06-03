import { Component, OnInit } from '@angular/core';
import {SearchService, SearchData} from '../../core/services/search.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  search_data;
  
  constructor(public searchService:SearchService) {
      
  }

  ngOnInit(): void {    
    this.searchService._search_data.subscribe((value) => {
      this.search_data = value
    });  
  }


}

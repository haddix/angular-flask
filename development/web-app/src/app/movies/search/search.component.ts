import { Component, OnInit } from '@angular/core';
import {SearchService} from '../../core/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  search_terms = "";
  
  constructor(public search_svc:SearchService) { 
   
  }

  ngOnInit(): void {
  }

  do_search(){
    this.search_svc.do_search(this.search_terms);
  }
  

}

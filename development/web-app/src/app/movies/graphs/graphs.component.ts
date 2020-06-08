import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {MoviesGraphService, MoviesGraphData} from '../../core/services/movies-graphs.service';


@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  graph_data: Observable<MoviesGraphData>;
  
  constructor(graph_svc:MoviesGraphService) { 
    this.graph_data = graph_svc.getGraphData("");
  }

  ngOnInit(): void {
  }

}

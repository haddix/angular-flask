import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {GraphService, GraphData} from '../core/services/graphs.service';


@Component({
  selector: 'app-sample-graphs',
  templateUrl: './sample-graphs.component.html',
  styleUrls: ['./sample-graphs.component.css']
})
export class SampleGraphsComponent implements OnInit {

  graph_data$: Observable<GraphData>;
  
  constructor(map_svc:GraphService) { 
    this.graph_data$ = map_svc.getGraphData();
  }

  ngOnInit(): void {
  }

}

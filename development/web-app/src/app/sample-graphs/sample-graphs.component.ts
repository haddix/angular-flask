import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {GraphService, GraphData} from '../core/services/graphs.service';


@Component({
  selector: 'app-sample-graphs',
  templateUrl: './sample-graphs.component.html',
  styleUrls: ['./sample-graphs.component.css']
})
export class SampleGraphsComponent implements OnInit {

  pie_data: Observable<GraphData>;
  multi_data: Observable<GraphData>;
  
  constructor(map_svc:GraphService) { 
    this.pie_data = map_svc.getGraphData("pie");
    this.multi_data = map_svc.getGraphData("multi");
    // this.multi_data = map_svc.getGraphData("timneline");
  }

  ngOnInit(): void {
  }

}

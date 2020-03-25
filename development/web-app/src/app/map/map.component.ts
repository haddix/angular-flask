import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {MapDataService, MapData} from '../core/services/map-data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  map_data$: Observable<MapData>;
  map_data;

  constructor(map_svc:MapDataService) { 
    this.map_data$ = map_svc.getMapData();
  }

  ngOnInit() {
    this.map_data = this.map_data$.subscribe(
      val => {
        this.map_data = val;
        console.log(this.map_data);
      }
    )
  }

}

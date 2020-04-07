import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Layer } from 'leaflet';
import * as L from 'leaflet';
import '../../../../node_modules/leaflet.motion/dist/leaflet.motion.js';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.css']
})
export class LeafletComponent implements OnChanges {

  @Input() map_data;
  map: Map;
  markers: Layer[] = [];

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    }
  };

  route1 = [[39.020425,-77.026329],[19.592166, -155.297919]];
  route2 = [[39.020425,-77.026329],[51.338598, 10.397538]];

  route3 = [[41.141649, -96.226552], [51.338598, 10.397538]];
  route4 = [[39.020425, 77.026329], [51.338598, 10.397538]];
  route5 = [[39.020425, -77.026329], [51.338598, 10.397538]];
  route6 = [[39.020425, -77.026329], [51.338598, 10.397538]];

  draw_route3: any;
  
  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: [ this.streetMaps], //, this.route, this.summit, this.paradise 
    zoom: 2,
    center: latLng([ 39.020425, -77.026329 ])
  };

 

  constructor() { }

  onMapReady(map: Map) {
    this.map = map;
    // map.fitBounds(this.markers.getBounds(), {
    //   padding: point(24, 24),
    //   maxZoom: 12,
    //   animate: true
    // });
  }

  ngOnChanges() {    
    if(this.map_data){
      this.map_data.locations.forEach( (location, index) => {
        const new_marker = marker(location.coords, {
          icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        });

        this.markers.push(new_marker);        
      });  

      

      const route1 = L.motion.polyline(this.route1, {
        color: "red",
        weight:2
      }, {
        auto: true,
        duration: 3000
      }, {
        removeOnEnd: true,
        showMarker: false,
        icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
      });

      route1.addTo(this.map);
      
      const route2 = L.motion.polyline(this.route2, {
        color: "blue",
        weight:2
      }, {
        auto: true,
        duration: 3000
      }, {
        removeOnEnd: true,
        showMarker: false,
        icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
      });

      route2.addTo(this.map);

      this.draw_route3 = L.motion.polyline(this.route3, {
        color: "blue",
        weight:2
      }, {
        auto: true,
        duration: 3000
      }, {
        removeOnEnd: true,
        showMarker: false,
        icon: L.divIcon({html: "<i class='fa fa-plane fa-2x' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
      });

      this.draw_route3.addTo(this.map);

      this.layersControl["overlays"] = {"pline":route1};

  
    }

  }


  start_draw(){
      this.draw_route3.motionStart();
  }

  pause_draw(){
    this.draw_route3.motionPause();
  }

  resume_draw(){
    this.draw_route3.motionResume();
  }

  stop_draw(){
    this.draw_route3.motionStop();
  }

  speedup_draw(){
    this.draw_route3.motionDuration(1000);
    this.draw_route3.motionStart();
  }

}

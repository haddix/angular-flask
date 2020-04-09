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
  darkMode = tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
	  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  layersControl = {
    baseLayers: {
      'Dark': this.darkMode,
      'Wikimedia Maps': this.wMaps
    }
  };


  route_speed = 3000;

  routes:any;
  
  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: [ this.darkMode], //, this.route, this.summit, this.paradise 
    zoom: 11,
    center: latLng([ 41.15444, -96.04225 ])
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
    var overlays = {};
    this.routes = [];
    if(this.map_data){
      this.map_data.locations.forEach( (location, index) => {
        const new_marker = marker(location.coordinates[0], {
          icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        });

        this.markers.push(new_marker);

        const route = L.motion.polyline(location.coordinates, {
          color: "#" + Math.floor(Math.random()*16777215).toString(16),
          weight:4
        }, {
          auto: true,
          duration: this.route_speed
        }, {
          removeOnEnd: true,
          showMarker: false,
          // icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
        });

        this.routes.push(route);

        route.addTo(this.map);

        overlays[location.name] = route;
        
                
      });  

        
    }
    this.layersControl["overlays"] = overlays;

  }


  start_draw(){
    this.routes.forEach( (route, index) => {
      route.motionStart();
    });      
  }

  pause_draw(){    
    this.routes.forEach( (route, index) => {
      route.motionPause();
    });  
  }

  resume_draw(){    
    this.routes.forEach( (route, index) => {
      route.motionResume();
    });  
  }

  stop_draw(){    
    this.routes.forEach( (route, index) => {
      route.motionStop();
    });  
  }

  speedup_draw(){    
    this.route_speed = this.route_speed - 500;
    console.log(this.route_speed);
    this.routes.forEach( (route, index) => {
      route.motionDuration(this.route_speed);
      route.motionStart();
    });  
  }

  slowdown_draw(){    
    this.route_speed = this.route_speed + 500;
    this.routes.forEach( (route, index) => {
      route.motionDuration(this.route_speed);
      route.motionStart();
    });  
  }

}

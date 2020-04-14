import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, Layer } from 'leaflet';
import * as L from 'leaflet';
import '../../../../node_modules/leaflet.motion/dist/leaflet.motion.js';
import '@elfalem/leaflet-curve';


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
    zoom: 10,
    center: latLng([ 41.15444, -96.04225 ])//  
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
    
    var delay_bomb = 0;
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
        },  {
          removeOnEnd: true,
          showMarker: false,
          // icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
        }).motionDuration(this.route_speed);
        delay_bomb += this.route_speed;

        this.routes.push(route);

        // route.addTo(this.map);

        overlays[location.name] = route;
        
                
      });  
      

      var seqGroup = L.motion.seq(this.routes).addTo(this.map);
      seqGroup.motionStart();

      


      setTimeout(() =>{
        
        this.map.fitBounds([[41.15444, -96.04225],[50.14874640066278,14.106445312500002]], {
          padding: point(24, 24),
          maxZoom: 12,
          animate: true
        });
        
        this.options = {
          layers: [ this.darkMode], //, this.route, this.summit, this.paradise 
          zoom: 10,
          center: latLng([ 46.86019101567027,-29.047851562500004  ])//  41.15444, -96.04225
        };

        var pathOne = L.curve([
          'M',[50.14874640066278,14.106445312500002],
          'Q', this.get_midpoint([50.14874640066278,14.106445312500002], [41.15444, -96.04225], 'up'),//[59.777859, -44.007279],
          [41.15444, -96.04225]
        ], {animate: 2000}).addTo(this.map);
        
      
        
        setTimeout(() =>{
          var circle = L.circleMarker(
            [41.15444, -96.04225], 
            { radius: 15, color: 'red', fillOpacity: 0.6, weight: 1 }) 
            .addTo(this.map);
  
  
          var newRadius = 100;
          var interval = setInterval(function() {
            var currentRadius = circle.getRadius();
            console.debug("currentRadius", currentRadius)
            if (currentRadius < newRadius) {
                circle.setRadius(++currentRadius);
                console.debug("new ", circle.getRadius())
            } else {
                clearTimeout(interval);
            }
          }, 1);
  
        }, 2000);

      }, delay_bomb);          

      
    }
    this.layersControl["overlays"] = overlays;
    
    


  }




  get_midpoint(point1, point2, direction){
    var latlngs = [];

    var latlng1 = point1,
      latlng2 = point2;

    var offsetX = latlng2[1] - latlng1[1],
      offsetY = latlng2[0] - latlng1[0];

    var r = Math.sqrt( Math.pow(offsetX, 2) + Math.pow(offsetY, 2) ),
      theta = Math.atan2(offsetY, offsetX);

    var thetaOffset = (3.14/10);

    var r2 = (r/2)/(Math.cos(thetaOffset)),
      theta2 = theta + thetaOffset;

    if(direction == "up"){
      r2 = (r/2)/(Math.cos(thetaOffset)),
      theta2 = theta - thetaOffset;
    }

    var midpointX = (r2 * Math.cos(theta2)) + latlng1[1],
      midpointY = (r2 * Math.sin(theta2)) + latlng1[0];

    var midpointLatLng = [midpointY, midpointX];

    return midpointLatLng;
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

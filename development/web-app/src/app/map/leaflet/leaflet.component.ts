import { Component, OnInit, OnChanges, Input } from '@angular/core';
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
  map: L.Map;
  
  // Define our base layers so we can reference them multiple times
  darkMode = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
	  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  });
  wMaps = L.tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  layersControl = {
    baseLayers: {
      'Dark': this.darkMode,
      'Wikimedia Maps': this.wMaps
    }
  };


  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: [ this.darkMode], //, this.route, this.summit, this.paradise 
    zoom: 10,
    center: L.latLng([ 41.15444, -96.04225 ])//  
  };

  
  markers: L.Layer[] = [];
  route_speed = 3000;
  routes:any;
  seqGroup:any;
  overlays:any;

 

  constructor() { }

  onMapReady(map: L.Map) {
    this.map = map;
  }

  ngOnChanges() {    
        
    this.overlays = {};
    this.routes = [];
    if(this.map_data){
      
      this.map_data.locations.forEach( (location, index) => {
        var new_marker = L.marker(location.coordinates[0], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<i class='fas fa-map-pin' style='color:red; font-size: 20px;'></i>",
            iconSize: [30, 42],
            iconAnchor: [5, 20]
          })
        });

        this.markers.push(new_marker);

        var route = L.motion.polyline(location.coordinates, {
          color: "steelblue",// + Math.floor(Math.random()*16777215).toString(16),
          weight:4
        }, 
        {          
          auto:false,
          duration:this.route_speed
        },
        {
          removeOnEnd: true,
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<i class='fas fa-map-pin' style='color:red; font-size: 20px;'></i>",
            iconSize: [30, 42],
            iconAnchor: [5, 20]
          })
        }).addTo(this.map);


        this.routes.push(route);

        this.overlays[location.name] = route;
        
                
      });  
      

      this.seqGroup = L.motion.seq(this.routes).addTo(this.map);

      
    }
    this.layersControl["overlays"] = this.overlays;
  

  }


  
  start_draw_curve(){        
      
    this.map.fitBounds([[41.15444, -96.04225],[50.14874640066278,14.106445312500002]], {
      padding: L.point(24, 24),
      maxZoom: 12,
      animate: true
    });
  

    var pathOne = L.curve([
      'M',[50.14874640066278,14.106445312500002],
      'Q', this.get_midpoint([50.14874640066278,14.106445312500002], [41.15444, -96.04225], 'up'),//[59.777859, -44.007279],
      [41.15444, -96.04225]
    ], {animate: 2000});
    
    this.overlays["curve"] = pathOne;
    this.layersControl["overlays"] = this.overlays;

    setTimeout(() =>{
      pathOne.addTo(this.map);
    }, 500);
    
  }
  
  
  start_draw(){
    this.map.fitBounds([[41.15444, -96.04225],[41.15444, -96.04225]], {
      padding: L.point(24, 24),
      maxZoom: 10,
      animate: true
    });
    this.seqGroup.motionStart();
    // this.routes.forEach( (route, index) => {
    //   route.motionStart();
    // });      
  }

  pause_draw(){    
    this.seqGroup.motionPause();  
  }

  resume_draw(){    
    this.seqGroup.motionResume(); 
  }

  stop_draw(){    
    this.seqGroup.motionStop(); 
  }

  speedup_draw(){    
    this.route_speed = this.route_speed - 500;
    this.routes.forEach( (route, index) => {
      route.motionDuration(this.route_speed);
    });  
  }

  slowdown_draw(){    
    this.route_speed = this.route_speed + 500;
    this.routes.forEach( (route, index) => {
      route.motionDuration(this.route_speed);
    });  
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


  tell_a_story(){
    this.overlays = {};
    this.routes = [];
    this.routes = [];
    var timeUntilLaunch = 0;
    this.map.fitBounds([[34.038474, -118.252141],[38.631101, -80.651906]], {
      padding: L.point(24, 24),
      maxZoom: 5,
      animate: true
    });
    if(this.map_data){
      console.log("TELL A STORY")
      this.map_data.story.forEach( (location, index) => {        
        timeUntilLaunch += this.route_speed;
        var icon = "";
        var color = "";
        if(location.type == "plane"){
          icon = "<i class='fas fa-plane' style='color:skyblue; font-size: 20px;'></i>";
          color = "skyblue";
        }
        else{
          icon = "<i class='fas fa-car' style='color:steelblue; font-size: 20px;'></i>";
          color = "steelblue";
        }

        const route = L.motion.polyline(location.coordinates, {
          color: color,
          weight:4
        },  {          
          auto:false,
          duration:this.route_speed
        },
        {
          removeOnEnd: true,
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: icon,
            iconSize: [30, 42],
            iconAnchor: [5, 20]
          })
        }).motionDuration(this.route_speed);

        this.routes.push(route);
                        
      });  
      

      this.seqGroup = L.motion.seq(this.routes).addTo(this.map);
      this.seqGroup.motionStart();

      setTimeout(() =>{
        //fire one
        var pathOne = L.curve([
          'M',[38.63402,- 79.83697],
          'Q', this.get_midpoint([38.63402,- 79.83697], [36.187023, -115.255986], 'up'),//[59.777859, -44.007279],
          [36.187023, -115.255986]
        ], {animate: 2000}).addTo(this.map);
        
        var pathTwo= L.curve([
          'M',[38.63402,- 79.83697],
          'Q', this.get_midpoint([38.63402,- 79.83697], [39.095460, -94.554407], 'up'),//[59.777859, -44.007279],
          [39.095460, -94.554407]
        ], {animate: 2000}).addTo(this.map);

        var pathThree = L.curve([
          'M',[38.63402,- 79.83697],
          'Q', this.get_midpoint([38.63402,- 79.83697], [40.759613, -111.827027], 'up'),//[59.777859, -44.007279],
          [40.759613, -111.827027]
        ], {animate: 2000}).addTo(this.map);

        
        //bomb goes off
        setTimeout(() =>{
          var circle = L.circleMarker(
            [36.187023, -115.255986], 
            { radius: 10, color: 'red', fillOpacity: 0.6, weight: 1 }) 
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
      }, timeUntilLaunch + 1000);
      
    }
    // this.layersControl["overlays"] = this.overlays;

    


    // this.map.fitBounds([[41.15444, -96.04225],[50.14874640066278,14.106445312500002]], {
    //   padding: point(24, 24),
    //   maxZoom: 12,
    //   animate: true
    // });


    // var pathOne = L.curve([
    //   'M',[50.14874640066278,14.106445312500002],
    //   'Q', this.get_midpoint([50.14874640066278,14.106445312500002], [41.15444, -96.04225], 'up'),//[59.777859, -44.007279],
    //   [41.15444, -96.04225]
    // ], {animate: 2000}).addTo(this.map);
    
    // this.overlays["curve"] = pathOne;
    // this.layersControl["overlays"] = this.overlays;
    
    // setTimeout(() =>{
    //   var circle = L.circleMarker(
    //     [41.15444, -96.04225], 
    //     { radius: 15, color: 'red', fillOpacity: 0.6, weight: 1 }) 
    //     .addTo(this.map);


    //   var newRadius = 100;
    //   var interval = setInterval(function() {
    //     var currentRadius = circle.getRadius();
    //     console.debug("currentRadius", currentRadius)
    //     if (currentRadius < newRadius) {
    //         circle.setRadius(++currentRadius);
    //         console.debug("new ", circle.getRadius())
    //     } else {
    //         clearTimeout(interval);
    //     }
    //   }, 1);

    // }, 2000);
  }

}

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

  route1 = [{"lat":39.020425,"lng":-77.026329},{"lat":19.592166, "lng":-155.297919}];
  route2 = [{"lat":39.020425,"lng":-77.026329},{"lat":51.338598, "lng":10.397538}];

 
  
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
        color: "red"
      }, {
        auto: true,
        duration: 3000
      }, {
        removeOnEnd: true,
        showMarker: false,
        icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(0,0)})
      });

      route1.addTo(this.map);
      
      const route2 = L.motion.polyline(this.route2, {
        color: "red"
      }, {
        auto: true,
        duration: 3000
      }, {
        removeOnEnd: true,
        showMarker: false,
        icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(0,0)})
      });

      route2.addTo(this.map);

      this.layersControl["overlays"] = {"pline":route1};

  
    }
      
    

      
  }

}

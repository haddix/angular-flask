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

  carRoute = [{"lat":51.129466960517135,"lng":2.6630860380828385},{"lat":51.07664802198799,"lng":2.738342452794314},{"lat":51.055941653758396,"lng":2.749328780919314},{"lat":51.00067931792692,"lng":2.7778932172805075},{"lat":50.943967078334666,"lng":2.826233077794314},{"lat":50.89794502437422,"lng":2.867431640625},{"lat":50.846655509682435,"lng":2.9003906250000004},{"lat":50.824458803489804,"lng":2.9619141295552254},{"lat":50.79669804718136,"lng":3.0190430022776127},{"lat":50.76475273687021,"lng":3.1025391630828385},{"lat":50.72444284265441,"lng":3.1772460602223873},{"lat":50.65207604172236,"lng":3.282714877277613},{"lat":50.60469890778924,"lng":3.357421942055226},{"lat":50.562855920362125,"lng":3.425537142902613},{"lat":50.5181824559931,"lng":3.495849743485451},{"lat":50.47905843134065,"lng":3.570556808263064},{"lat":50.47626260659788,"lng":3.629882913082838},{"lat":50.492339146862776,"lng":3.772155828773976},{"lat":50.514693454200405,"lng":3.903991766273976},{"lat":50.510502790942944,"lng":3.9633178710937504},{"lat":50.49792872905663,"lng":4.024841375648976},{"lat":50.48185790425272,"lng":4.073730502277614},{"lat":50.47347053735934,"lng":4.133056774735452},{"lat":50.4776644868276,"lng":4.20336937531829},{"lat":50.479062245100565,"lng":4.231933560222388}];

  

  



  
  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: [ this.streetMaps], //, this.route, this.summit, this.paradise 
    zoom: 7,
    center: latLng([ 51,2 ])
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

      // const pline = polyline(this.carRoute,{

      // })

      // this.markers.push(pline);

      
      // const pline = L.motion.polyline(
      //   this.carRoute,
      //   {colors: "red"},
      //   // {easing: L.Motion.Ease.easeInOutElastic}, 
      //   {
      //     removeOnEnd: true,
      //     icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
      //   }
      // ).motionDuration(5000);

      // this.layersControl["overlays"] = {"pline":pline};

      // var seqGroup = L.motion.seq([pline]);
      // seqGroup.motionStart();

      // // this.markers.push(seqGroup);

      // seqGroup.motionStart();

      // var mot = L.motion.polyline(this.carRoute, {
      //   colors: "red"
      // },
      // {
      //   removeOnEnd: true,
      //   icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(27.5, 24)})
      // }).motionDuration(5000).addTo(this.map);
      // mot.motionStart();


      const pline = L.motion.polyline(this.carRoute, {
        color: "red"
      }, {
        auto: true,
        duration: 3000
      }, {
        removeOnEnd: true,
        showMarker: false,
        icon: L.divIcon({html: "<i class='fa fa-car fa-2x' aria-hidden='true'></i>", iconSize: L.point(0,0)})
      });

      pline.addTo(this.map);

      this.layersControl["overlays"] = {"pline":pline};

  
    }
      
    

      
  }

}

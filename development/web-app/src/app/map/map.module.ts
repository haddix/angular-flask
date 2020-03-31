import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouterModule, Routes} from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletComponent } from './leaflet/leaflet.component';

const mapRoutes: Routes = [
  {path: '', component: MapComponent}
]



@NgModule({
  declarations: [MapComponent, LeafletComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(mapRoutes),
    ComponentsModule,
    LeafletModule.forRoot()
  ]
})
export class MapModule { }

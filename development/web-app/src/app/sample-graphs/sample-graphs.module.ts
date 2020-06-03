import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleGraphsComponent } from './sample-graphs.component';
import { RouterModule, Routes} from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieComponent } from './pie/pie.component';
import { MultiComponent } from './multi/multi.component';
import { LineComponent } from './line/line.component';
import { BarComponent } from './bar/bar.component';
import { PolarComponent } from './polar/polar.component';
import { GaugeComponent } from './gauge/gauge.component';
import { TimelineComponent } from './timeline/timeline.component';

const graphsRoutes: Routes = [
  {path: '', component: SampleGraphsComponent}
]

@NgModule({
  declarations: [SampleGraphsComponent, PieComponent, MultiComponent, LineComponent, BarComponent, PolarComponent, GaugeComponent, TimelineComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(graphsRoutes),
    NgxChartsModule
  ]
})
export class SampleGraphsModule { }

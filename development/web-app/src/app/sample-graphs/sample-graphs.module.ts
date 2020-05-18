import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleGraphsComponent } from './sample-graphs.component';
import { GraphsComponent } from './graphs/graphs.component';
import { RouterModule, Routes} from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const graphsRoutes: Routes = [
  {path: '', component: SampleGraphsComponent}
]

@NgModule({
  declarations: [SampleGraphsComponent, GraphsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(graphsRoutes),
    NgxChartsModule
  ]
})
export class SampleGraphsModule { }

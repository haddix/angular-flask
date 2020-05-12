import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleTablesComponent } from './sample-tables.component';
import { TableComponent } from './table/table.component';
import { RouterModule, Routes} from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const tablesRoutes: Routes = [
  {path: '', component: SampleTablesComponent}
]

@NgModule({
  declarations: [SampleTablesComponent, TableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(tablesRoutes),
    NgxDatatableModule
  ]
})
export class SampleTablesModule { }

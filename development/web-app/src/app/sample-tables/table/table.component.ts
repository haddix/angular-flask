import { Component, ViewChild, Input,OnChanges } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnChanges {
  
  @Input() table_data;
  @Input() columns;

  rows = [];
  temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  loadingIndicator = true;
  reorderable = true;
  
  constructor() { }

  ngOnChanges() { 
    this.rows = this.table_data;
    this.columns = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];
    this.temp = this.table_data;
    this.loadingIndicator = false;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }


}

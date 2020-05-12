import { Component, OnInit, Input,OnChanges } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnChanges {
  
  @Input() table_data;

  rows = [];
  columns = [];
  
  constructor() { }

  ngOnChanges() { 
    this.rows = this.table_data.rows;
    this.columns = this.table_data.columns;
  }


}

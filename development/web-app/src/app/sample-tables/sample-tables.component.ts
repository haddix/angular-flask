import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {TableDataService, TableData} from '../core/services/table-data.service';

@Component({
  selector: 'app-sample-tables',
  templateUrl: './sample-tables.component.html',
  styleUrls: ['./sample-tables.component.css']
})
export class SampleTablesComponent implements OnInit {


  table_data$: Observable<TableData>;
  
  constructor(map_svc:TableDataService) { 
    this.table_data$ = map_svc.getTableData();
  }

  ngOnInit(): void {
  }

}

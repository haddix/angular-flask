import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-movie-types',
  templateUrl: './movie-types.component.html',
  styleUrls: ['./movie-types.component.css']
})
export class MovieTypesComponent implements OnChanges {

  @Input() graph_data;
  @Input() graph_height;

  single: any[];
  view: any[] = [400, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'left';

  colorScheme = {
    domain: ['red', 'yellow', 'green', 'blue', 'purple', 'orange']
  };

  constructor() {
    
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onResize(event) {
    //this.view = [event.target.innerWidth / 1.35, 400];
  }

  ngOnChanges(): void {
    Object.assign(this, this.graph_data?.data);
    console.log(this.graph_data?.data);
  }

}

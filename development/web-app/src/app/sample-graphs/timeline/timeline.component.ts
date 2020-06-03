import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  multi0: any[] = [
    {
      name: 'Red',
      series: [
        {
          name: new Date(2017, 0, 1, 2, 34, 17),
          value: 294
        },
        {
          name: new Date(2017, 1, 1, 2, 34, 17),
          value: 314
        },
        {
          name: new Date(2017, 2, 1, 2, 34, 17),
          value:  264
        }
      ]
    },
    {
      name: 'White',
      series: [
        {
          name: new Date(2017, 0, 1, 2, 34, 17),
          value: 347
        },
        {
          name: new Date(2017, 1, 1, 2, 34, 17),
          value: 369
        },
        {
          name: new Date(2017, 2, 1, 2, 34, 17),
          value:  325
        }
      ]
    },
    {
      name: 'Blue',
      series: [
        {
          name: new Date(2017, 0, 1, 2, 34, 17),
          value: 200
        },
        {
          name: new Date(2017, 1, 1, 2, 34, 17),
          value: 220
        },
        {
          name: new Date(2017, 2, 1, 2, 34, 17),
          value:  230
        }
      ]
    }
  ];
  multi1: any[] = [
    {
      name: 'simplex',
      series: [
        {
          name: 'A',
          value: 29
        },
        {
          name: 'B',
          value: 31
        },
        {
          name: 'C',
          value: 26
        },
        {
          name: 'D',
          value: 37
        },
        {
          name: 'E',
          value: 30
        },
        {
          name: 'F',
          value: 35
        }
      ]
    },
    {
      name: 'duplex',
      series: [
        {
          name: 'A',
          value: 20
        },
        {
          name: 'B',
          value: 22
        },
        {
          name: 'C',
          value: 30
        },
        {
          name: 'D',
          value: 29
        },
        {
          name: 'E',
          value: 31
        },
        {
          name: 'F',
          value: 27
        }
      ]
    }
  ];

  multi: any[];  
  view: any[] = [700, 400];

  constructor() {
    this.multi
  }
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Color Value';
  timeline = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // line, area
  autoScale = true;
  
  
  
  onSelect(event) {
    console.log(event);
  }
  
  toggleData() {
    if (this.multi === this.multi0) {
      this.timeline = false;
      this.multi = this.multi1;
      this.xAxisLabel = 'Letter';
      this.yAxisLabel = 'Some Other Value';
    } else {
      this.timeline = true;
      this.multi = this.multi0;
      this.xAxisLabel = 'Date';
      this.yAxisLabel = 'Color Value';
    }
  }
  
  ngOnInit() {
    this.multi = this.multi0;
  }

}

import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [

    trigger('fadeInOut', [
      state('start', style({
        opacity: 0
      })),
      state('end', style({
        opacity: 1
      })),
      transition('start=>end', animate(2000)),
    ]),

    trigger('EnterLeft', [
      state('start', style({
        opacity: 0
      })),
      state('end', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('start=>end', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ])
    ]),

    trigger('EnterRight', [
      state('start', style({
        opacity: 0
      })),
      state('end', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('start=>end', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s 300ms ease-in')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(() =>{
      this.current_state[0] = "end";
      setTimeout(() =>{
        this.current_state[1] = "end";
        setTimeout(() =>{
          this.current_state[2] = "end";
          setTimeout(() =>{
            this.current_state[3] = "end";
            setTimeout(() =>{
              this.current_state[4] = "end";
              setTimeout(() =>{
                this.current_state[5] = "end";
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  current_state = [
    'start',
    'start',
    'start',
    'start',
    'start',
    'start',
    'start',
    'start',
    'start'
  ];
  

}

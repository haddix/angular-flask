import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import {SharedModule} from '../shared.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports:[
    HeaderComponent,
    RouterLink
  ]
})
export class ComponentsModule { }

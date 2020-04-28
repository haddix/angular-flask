import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes} from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';


const homeRoutes: Routes = [
  {path: '', component: HomeComponent}
]



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    ComponentsModule,
  ]
})
export class HomeModule { }

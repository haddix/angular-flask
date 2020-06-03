import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies.component';
import { SearchComponent } from './search/search.component';
import { ListComponent } from './list/list.component';
import { FormsModule } from '@angular/forms';

const moviesRoutes: Routes = [
  {path: '', component: MoviesComponent}
]

@NgModule({
  declarations: [MoviesComponent, SearchComponent, ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(moviesRoutes),
    FormsModule,
  ]
})
export class MoviesModule { 
  
}

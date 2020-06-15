import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies.component';
import { SearchComponent } from './search/search.component';
import { ListComponent } from './list/list.component';
import { FormsModule } from '@angular/forms';
import { GraphsComponent } from './graphs/graphs.component';
import { MovieTypesComponent } from './graphs/movie-types/movie-types.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FavoritesComponent } from './favorites/favorites.component';
import {SharedModule} from '../shared/shared.module';


const moviesRoutes: Routes = [
  {path: '', component: MoviesComponent}
]

@NgModule({
  declarations: [MoviesComponent, SearchComponent, ListComponent, GraphsComponent, MovieTypesComponent, FavoritesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(moviesRoutes),
    FormsModule,
    NgxChartsModule,
    SharedModule
  ]
})
export class MoviesModule { 
  
}

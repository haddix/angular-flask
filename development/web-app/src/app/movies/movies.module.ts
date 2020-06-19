import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies.component';
import { SearchComponent } from './search/search.component';
import { ListComponent } from './list/list.component';
import { GraphsComponent } from './graphs/graphs.component';
import { MovieTypesComponent } from './graphs/movie-types/movie-types.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FavoritesComponent } from './favorites/favorites.component';
import {SharedModule} from '../shared/shared.module';
import { AddItemComponent } from './add-item/add-item.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';



const moviesRoutes: Routes = [
  {path: '', component: MoviesComponent}
]

@NgModule({
  declarations: [MoviesComponent, SearchComponent, ListComponent, GraphsComponent, MovieTypesComponent, FavoritesComponent, AddItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(moviesRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    SharedModule
  ]
})
export class MoviesModule { 
  
}

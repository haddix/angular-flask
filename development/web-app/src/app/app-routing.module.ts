import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:"", redirectTo:"graphs", pathMatch:"full"},
  {path:"home", loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path:"map", loadChildren: () => import('./map/map.module').then(m => m.MapModule)},
  {path:"forms", loadChildren: () => import('./sample-forms/sample-forms.module').then(m => m.SampleFormsModule)},
  {path:"trees", loadChildren: () => import('./sample-tree/sample-tree.module').then(m => m.SampleTreeModule)},
  {path:"tables", loadChildren: () => import('./sample-tables/sample-tables.module').then(m => m.SampleTablesModule)},
  {path:"graphs", loadChildren: () => import('./sample-graphs/sample-graphs.module').then(m => m.SampleGraphsModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

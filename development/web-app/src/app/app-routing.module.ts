import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:"", redirectTo:"home", pathMatch:"full"},
  {path:"home", loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path:"map", loadChildren: () => import('./map/map.module').then(m => m.MapModule)},
  {path:"forms", loadChildren: () => import('./sample-forms/sample-forms.module').then(m => m.SampleFormsModule)},
  {path:"trees", loadChildren: () => import('./sample-tree/sample-tree.module').then(m => m.SampleTreeModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

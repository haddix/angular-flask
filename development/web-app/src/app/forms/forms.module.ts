import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms.component';
import { FormComponent } from './form/form.component';
import { RouterModule, Routes} from '@angular/router';

const formsRoutes: Routes = [
  {path: '', component: FormsComponent}
]

@NgModule({
  declarations: [FormsComponent, FormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(formsRoutes),
  ]
})
export class FormsModule { }

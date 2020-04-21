import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleFormsComponent } from './sample-forms.component';
import { FormComponent } from './form/form.component';
import { RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const formsRoutes: Routes = [
  {path: '', component: SampleFormsComponent}
]


@NgModule({
  declarations: [SampleFormsComponent, FormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(formsRoutes),
    FormsModule, ReactiveFormsModule
  ]
})
export class SampleFormsModule { }

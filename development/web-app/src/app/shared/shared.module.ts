import { NgModule, ModuleWithProviders } from '@angular/core';
import {UserService} from '../core/services/user.service';

@NgModule({})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [UserService]
    };
  }
}
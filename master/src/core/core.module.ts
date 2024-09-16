import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class CoreModule {
  static forRoot(): CoreModule {
    return {
      ngModule: CoreModule,
      providers: []
    }
  }
}

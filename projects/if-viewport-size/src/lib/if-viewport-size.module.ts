import { ModuleWithProviders, NgModule } from '@angular/core';
import { defaultConfig } from './default.config';
import { IfViewportSizeConfig, ifViewportSizeConfig } from './if-viewport-size.config';
import { IfViewportSizeDirective } from './if-viewport-size.directive';
import { IfViewportSizeService } from './if-viewport-size.service';

@NgModule({
  declarations: [IfViewportSizeDirective],
  imports: [],
  exports: [IfViewportSizeDirective],
  providers: [
    IfViewportSizeService,
    { provide: ifViewportSizeConfig, useValue: defaultConfig },
  ],
})
export class IfViewportSizeModule {
  static withConfig(config: IfViewportSizeConfig): ModuleWithProviders {
    return {
      ngModule: IfViewportSizeModule,
      providers: [
        {
          provide: ifViewportSizeConfig,
          useValue: { ...defaultConfig, ...config },
        },
      ],
    };
  }
}

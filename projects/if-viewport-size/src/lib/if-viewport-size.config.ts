import { InjectionToken } from '@angular/core';

export interface IfViewportSizeConfig {
  medium: number;
  large: number;
}

export const ifViewportSizeConfig = new InjectionToken('if-viewport-size.config');

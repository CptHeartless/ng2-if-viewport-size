import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { defaultConfig } from './default.config';
import { ifViewportSizeConfig, IfViewportSizeConfig } from './if-viewport-size.config';
import { filterSameValues, mapWithDefaultTo } from './operators';
import { Viewport } from './viewport';

export type State = 'small' | 'medium' | 'large';

@Injectable({
  providedIn: 'root',
})
export class IfViewportSizeService {
  get state(): State {
    if (Viewport.width <= this.config.medium) {
      return 'small';
    }

    if (Viewport.width >= this.config.large) {
      return 'large';
    }

    return 'medium';
  }

  state$: Observable<State> = Viewport.onResize
    .pipe(
        debounceTime(100),
        mapWithDefaultTo<State>(() => this.state),
        filterSameValues<State>(),
      );

  constructor(
    @Inject(ifViewportSizeConfig) @Optional() private readonly config:
      IfViewportSizeConfig = defaultConfig,
  ) { }
}

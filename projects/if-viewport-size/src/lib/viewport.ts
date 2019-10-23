import { fromEvent } from 'rxjs';

// @dynamic
export abstract class Viewport {
  static onResize = fromEvent<UIEvent>(window, 'resize');

  static get width(): number {
    return window.innerWidth;
  }
}

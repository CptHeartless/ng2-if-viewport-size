import { from, fromEvent } from 'rxjs';
import { Viewport } from './viewport';

jest.mock('rxjs', () => ({
  fromEvent: jest.fn(() => 'Observable<UIEvent>'),
}));

describe('Viewport {}', () => {
  test('.onResize', () => {
    expect(fromEvent)
      .toBeCalledWith(window, 'resize');
    expect(Viewport.onResize)
      .toBe('Observable<UIEvent>');
  });

  test('.width', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 111,
    });

    expect(Viewport.width)
      .toBe(111);
  });
});

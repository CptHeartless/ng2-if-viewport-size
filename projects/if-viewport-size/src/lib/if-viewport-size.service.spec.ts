import { debounceTime } from 'rxjs/operators';
import { defaultConfig } from './default.config';
import { IfViewportSizeConfig } from './if-viewport-size.config';

import { IfViewportSizeService } from './if-viewport-size.service';
import { filterSameValues, mapWithDefaultTo } from './operators';
import { Viewport } from './viewport';

jest.mock('rxjs');
jest.mock('rxjs/operators');
jest.mock('./operators');

class ViewportMock {
  width = 0;
  onResize = {
    pipe: jest.fn(),
  };
}

jest.mock('./viewport', () => ({
  Viewport: new ViewportMock(),
}));

const customConfig: IfViewportSizeConfig = {
  medium: 100,
  large: 200,
};

describe('IfViewportSizeService {}', () => {
  let viewport: ViewportMock;
  beforeEach(() => {
    viewport = Viewport as unknown as ViewportMock;
    jest.clearAllMocks();
  });

  test.each([
    ['small', 'default', defaultConfig.medium, undefined],
    ['medium', 'default', defaultConfig.medium + 1, undefined],
    ['large', 'default', defaultConfig.large, undefined],
    ['small', 'custom', 50, customConfig],
    ['medium', 'custom', 150, customConfig],
    ['large', 'custom', 250, customConfig],
  ])(
    '.state for %s viewport with %s config',
    (state: string, _, screenWidth: number, config: IfViewportSizeConfig) => {
      viewport.width = screenWidth;
      const fixture = new IfViewportSizeService(config);

      expect(fixture.state)
        .toEqual(state);
    },
  );

  test('.state$', () => {
    viewport.onResize.pipe
      .mockReturnValue('onResizePipeResult');
    (debounceTime as jest.Mock)
      .mockReturnValue('debounceTimeResult');
    (mapWithDefaultTo as jest.Mock)
      .mockReturnValue('mapWithDefaultToResult');
    (filterSameValues as jest.Mock)
      .mockReturnValue('filterSameValuesResult');

    const fixture = new IfViewportSizeService();
    expect(fixture.state$)
      .toBe('onResizePipeResult');
    expect(viewport.onResize.pipe)
      .toBeCalledWith(
      'debounceTimeResult',
        'mapWithDefaultToResult',
        'filterSameValuesResult',
      );
    expect(debounceTime)
      .toBeCalledWith(100);
  });
});

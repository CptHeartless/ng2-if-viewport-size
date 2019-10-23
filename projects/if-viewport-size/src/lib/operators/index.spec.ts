import { cold, hot } from 'jest-marbles';
import { startWith } from 'rxjs/operators';
import { filterSameValues, mapWithDefaultTo } from './';

describe('operators', () => {
  test('filterSameValues()', () => {
    const values = { a: 'small', b: 'medium', c: 'large' };
    const source = cold('-a-b-b-c-c-a-a', values);
    const output = cold('-a-b---c---a--', values);

    expect(source.pipe(startWith('medium'), filterSameValues()))
      .toBeObservable(output);
  });

  test('mapWithDefaultTo()', () => {
    const source = hot('--a-a-|', { a: 'any' });
    const output = hot('a-a-a-|', { a: 'value' });

    expect(source.pipe(
      mapWithDefaultTo(() => 'value'),
    ))
      .toBeObservable(output);
  });
});

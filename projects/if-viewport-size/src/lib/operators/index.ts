import { OperatorFunction, pipe } from 'rxjs';
import { filter, map, mapTo, pairwise, startWith } from 'rxjs/operators';

export const filterSameValues = <R>(
): OperatorFunction<R, R> => pipe(
  pairwise(),
  filter(([old, cur]) => old !== cur),
  map(([, cur]) => cur),
);

export const mapWithDefaultTo = <R>(
  project: () => R,
): OperatorFunction<R, R> => pipe(
  startWith(project()),
  mapTo(project()),
);

// Read properties during render; destructuring in setup captures initial values.
export function createQueryResult<TResult extends object>(
  observer: QueryResultObserver<TResult>,
): Readonly<TResult> {
  const result = {} as TResult;
  const resultKeys = Object.keys(observer.getCurrentResult()) as (keyof TResult)[];

  for (const key of resultKeys) {
    Object.defineProperty(result, key, {
      enumerable: true,
      get: () => observer.getCurrentResult()[key],
    });
  }

  return result;
}

interface QueryResultObserver<TResult> {
  getCurrentResult(): TResult;
}

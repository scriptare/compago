export class Ok<T, _> {
  readonly ok = true;
  constructor(readonly value: T) {}
}

export class Err<_, E> {
  readonly ok = false;
  constructor(readonly value: E) {}
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export namespace Result {
  export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value);
  export const fail = <T, E>(err: E): Err<T, E> => new Err(err);
}

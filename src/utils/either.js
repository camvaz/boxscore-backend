'use strict'

/**
 *
 * @param {any} x
 * @returns
 */
export const Right = (x) => ({
  map: (f) => Right(f(x)),
  fold: (_, g) => g(x),
})

export const Left = (x) => ({
  map: (_) => Left(x),
  fold: (f, _) => f(x),
})

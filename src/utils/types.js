'use strict'

/**
 *
 * @param {any} x
 * @returns
 */
export const Right = (x) => ({
  ap: (other) => other.map(x),
  traverse: (of, f) => f(x).map(Right),
  map: (f) => Right(f(x)),
  fold: (_, g) => g(x),
  inspect: () => `Right(${x})`,
})

export const Left = (x) => ({
  chain: (f) => Left(x),
  ap: (other) => Left(x),
  traverse: (of, f) => of(Left(x)),
  map: (f) => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`,
})

export const fromNullable = (x) => (x != null ? Right(x) : Left(null))

export const tryCatch = (f) => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}

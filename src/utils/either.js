export const Right = (Type, x) => ({
  map: (_) => Type(x),
  fold: (_, err) => err(x),
})

export const Left = (Type, x) => ({
  map: (f) => Type(f(x)),
  fold: (f, _) => f(x),
})

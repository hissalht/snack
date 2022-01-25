export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = Math.abs(x1 - x2)
  const dy = Math.abs(y1 - y2)
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

export function minBy<T>(arr: T[], iteratee: (item: T) => number): T {
  let result: T = arr[0]
  let minValue: number = Infinity

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const value = iteratee(item)

    if (value < minValue) {
      result = item
    }
  }

  return result
}

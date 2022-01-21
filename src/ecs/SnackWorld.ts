import { createWorld, IWorld } from 'bitecs'

export interface SnackWorld extends IWorld {
  time: {
    delta: number
    elapsed: number
    then: number
  }
}

export function createSnackWorld(): SnackWorld {
  const world = createWorld()
  return {
    ...world,
    time: { delta: 0, elapsed: 0, then: performance.now() },
  }
}

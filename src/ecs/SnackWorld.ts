import { createWorld, IWorld } from 'bitecs'

export interface SnackWorld extends IWorld {
  time: {
    delta: number
    elapsed: number
    then: number
  }
  inputs: {
    left: boolean // player is steering left
    right: boolean // player is steering right
  }
  experience: number
}

export function createSnackWorld(): SnackWorld {
  const world = createWorld()

  return {
    ...world,
    time: { delta: 0, elapsed: 0, then: performance.now() },
    inputs: { left: false, right: false },
    experience: 0,
  }
}

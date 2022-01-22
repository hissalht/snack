import { defineQuery } from 'bitecs'
import { Direction } from '../components/Direction'

import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const movementQuery = defineQuery([Position, Direction, Velocity])

const ARENA_WIDTH = 256
const ARENA_HEIGHT = 256

/**
 * Update the Position component using the Velocity component
 *
 * TODO: split the bouncing logic into a different system BouncingSystem
 */
export const MovementSystem: SnackSystem = world => {
  const {
    time: { delta },
  } = world

  const ents = movementQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]

    const vx = Velocity.x[eid]
    const vy = Velocity.y[eid]

    let newX = Position.x[eid] + vx * delta
    let newY = Position.y[eid] + vy * delta

    // Horizontal bounce
    if (newX < 0) {
      Direction.angle[eid] = Math.PI - Direction.angle[eid]
      Velocity.x[eid] *= -1
      newX = -newX
    } else if (newX >= ARENA_WIDTH) {
      Velocity.x[eid] *= -1
      Direction.angle[eid] = Math.PI - Direction.angle[eid]
      newX = ARENA_WIDTH - (newX - ARENA_WIDTH)
    }

    // Vertical bounce
    if (newY < 0) {
      Direction.angle[eid] *= -1
      Velocity.y[eid] *= -1
      newY = -newY
    } else if (newY >= ARENA_HEIGHT) {
      Direction.angle[eid] *= -1
      Velocity.y[eid] *= -1
      newY = ARENA_HEIGHT - (newY - ARENA_HEIGHT)
    }

    Position.x[eid] = newX
    Position.y[eid] = newY
  }

  return world
}

import { defineQuery } from 'bitecs'

import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const movementQuery = defineQuery([Position, Velocity])

const ARENA_WIDTH = 256
const ARENA_HEIGHT = 256

/**
 * Update the Position component using the Velocity component
 */
export const MovementSystem: SnackSystem = world => {
  const {
    time: { delta },
  } = world

  const ents = movementQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]

    const angle = Velocity.angle[eid]
    const speed = Velocity.speed[eid]

    const newX = Position.x[eid] + Math.cos(angle) * speed * delta
    const newY = Position.y[eid] + Math.sin(angle) * speed * delta

    // Horizontal bounce
    if (newX < 0 || newX >= ARENA_WIDTH) {
      Velocity.angle[eid] = Math.PI - angle
    }

    // Vertical bounce
    if (newY < 0 || newY >= ARENA_HEIGHT) {
      Velocity.angle[eid] = -angle
    }

    Position.x[eid] = newX
    Position.y[eid] = newY
  }

  return world
}

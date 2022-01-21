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

    let newX = Position.x[eid] + Math.cos(angle) * speed * delta
    let newY = Position.y[eid] + Math.sin(angle) * speed * delta

    // Horizontal bounce
    if (newX < 0) {
      Velocity.angle[eid] = Math.PI - angle
      newX = -newX
    } else if (newX >= ARENA_WIDTH) {
      Velocity.angle[eid] = Math.PI - angle
      newX = ARENA_WIDTH - (newX - ARENA_WIDTH)
    }

    // Vertical bounce
    if (newY < 0) {
      Velocity.angle[eid] = -angle
      newY = -newY
    } else if (newY >= ARENA_HEIGHT) {
      Velocity.angle[eid] = -angle
      newY = ARENA_HEIGHT - (newY - ARENA_HEIGHT)
    }

    Position.x[eid] = newX
    Position.y[eid] = newY
  }

  return world
}

import { defineQuery, hasComponent } from 'bitecs'
import { ARENA_HEIGHT, ARENA_WIDTH } from '../../constants'

import { Bounce } from '../components/Bounce'
import { Direction } from '../components/Direction'
import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const bouncesQuery = defineQuery([Bounce, Position, Velocity])

/**
 * Make bouncing entity change their direction when hitting the arena bounds.
 *
 * @note This system should be run immediately after the movement system.
 */
export const BouncingSystem: SnackSystem = world => {
  const ents = bouncesQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]

    if (Bounce.max[eid] !== 0 && Bounce.count[eid] >= Bounce.max[eid]) {
      // Bounce limit reached
      continue
    }

    // Horizontal bounce
    if (Position.x[eid] < 0) {
      if (hasComponent(world, Direction, eid)) {
        Direction.angle[eid] = Math.PI - Direction.angle[eid]
      }
      Velocity.x[eid] *= -1
      Position.x[eid] = -Position.x[eid]
      Bounce.count[eid]++
    } else if (Position.x[eid] >= ARENA_WIDTH) {
      if (hasComponent(world, Direction, eid)) {
        Direction.angle[eid] = Math.PI - Direction.angle[eid]
      }
      Velocity.x[eid] *= -1
      Position.x[eid] = ARENA_WIDTH - (Position.x[eid] - ARENA_WIDTH)
      Bounce.count[eid]++
    }

    // Vertical bounce
    if (Position.y[eid] < 0) {
      if (hasComponent(world, Direction, eid)) {
        Direction.angle[eid] *= -1
      }
      Velocity.y[eid] *= -1
      Position.y[eid] = -Position.y[eid]
      Bounce.count[eid]++
    } else if (Position.y[eid] >= ARENA_HEIGHT) {
      if (hasComponent(world, Direction, eid)) {
        Direction.angle[eid] *= -1
      }
      Velocity.y[eid] *= -1
      Position.y[eid] = ARENA_HEIGHT - (Position.y[eid] - ARENA_HEIGHT)
      Bounce.count[eid]++
    }
  }

  return world
}

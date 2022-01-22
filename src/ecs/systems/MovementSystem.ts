import { defineQuery } from 'bitecs'

import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const movementQuery = defineQuery([Position, Velocity])

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

    const vx = Velocity.x[eid]
    const vy = Velocity.y[eid]

    Position.x[eid] += vx * delta
    Position.y[eid] += vy * delta
  }

  return world
}

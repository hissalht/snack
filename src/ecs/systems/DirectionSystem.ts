import { defineQuery } from 'bitecs'
import { Direction } from '../components/Direction'
import { Velocity } from '../components/Velocity'
import { SnackSystem } from '../SnackSystem'

const directionQuery = defineQuery([Direction, Velocity])

/**
 * Update entities velocity based on their direction.
 */
export const DirectionSystem: SnackSystem = world => {
  const ents = directionQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]

    const angle = Direction.angle[eid]
    Velocity.x[eid] = Math.cos(angle) * 20
    Velocity.y[eid] = Math.sin(angle) * 20
  }

  return world
}

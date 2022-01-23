import { defineQuery, removeEntity } from 'bitecs'
import { ARENA_HEIGHT, ARENA_WIDTH, DESPAWN_OFFSET } from '../../constants'
import { Position } from '../components/Position'
import { SnackSystem } from '../SnackSystem'

const positionnedQuery = defineQuery([Position])

/**
 * Remove entities which are outside the bounds of the arena.
 *
 * @note This system should be run immediately after the movement & bouncing systems.
 */
export const RemoveSystem: SnackSystem = world => {
  const ents = positionnedQuery(world)

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i]

    if (
      Position.x[eid] < -DESPAWN_OFFSET ||
      Position.x[eid] >= ARENA_WIDTH + DESPAWN_OFFSET ||
      Position.y[eid] < -DESPAWN_OFFSET ||
      Position.y[eid] >= ARENA_HEIGHT + DESPAWN_OFFSET
    ) {
      removeEntity(world, eid)
    }
  }

  return world
}
